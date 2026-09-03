import jwt from "jsonwebtoken";
import { BadRequestException } from "@nestjs/common";
import {
  ApplyFor,
  FulfilledRegistration,
  RegisterNewcomer,
  VOLUNTEER,
  STAFF,
  Credentials,
  ForgetMember,
  Membership,
  NewcomerRegistered,
  isNewAccountRegistration,
  isStaffRegistered,
  isVolunteerRegistered,
  registrationAccountStatuses,
  NewAccountFulfilledRegistration,
  ExistingAccountFulfilledRegistration,
} from "@overbookd/registration";
import { BE_AFFECTED } from "@overbookd/permission";
import { DomainEventService } from "../../domain-event/domain-event.service";
import { isString } from "class-validator";
import {
  STAFF_REGISTERED,
  VOLUNTEER_REGISTERED,
} from "@overbookd/domain-events";
import { checkStaffInvitationTokenValidity } from "../membership-application/staff/jwt.utils";
import { jwtConstants } from "../../jwt-constants";
import { ZitadelService } from "../../user/zitadel.service";
import {
  registrationSteps,
  RegistrationFormStep,
  RegistrationFormStepWithData,
  RegistrationLoginStep,
  RegistrationCompletedStep,
  RegistrationFormStepUser,
} from "@overbookd/http";
import { RequestHydratedUser } from "../../authentication-zitadel/request-hydrated-user";

type Member = {
  forget: Readonly<ForgetMember>;
  register: Readonly<RegisterNewcomer>;
  applyFor: Readonly<ApplyFor>;
};

type Service = {
  event: Readonly<DomainEventService>;
  zitadel: Readonly<ZitadelService>;
};

export type UserForRegistrationRepository = {
  getZitadelIdByEmail: (email: string) => Promise<string | null>;
  getByEmail: (email: string) => Promise<RegistrationFormStepUser>;
  getById: (id: number) => Promise<RegistrationFormStepUser>;
  updateZitadelIdByEmail: (email: string, zitadelId: string) => Promise<void>;
};

export type MembershipApplicationForRegistrationRepository = {
  hasValidApplication: (id: number) => Promise<boolean>;
};

type Repository = {
  user: Readonly<UserForRegistrationRepository>;
  application: Readonly<MembershipApplicationForRegistrationRepository>;
};

export class RegistrationService {
  constructor(
    private readonly member: Member,
    private readonly service: Service,
    private readonly repository: Repository,
  ) {}

  async checkUnauthenticatedUser(
    email: string,
  ): Promise<RegistrationLoginStep | RegistrationFormStepWithData> {
    email = email.toLowerCase().trim();
    const zitadelUser = await this.service.zitadel.getZitadelUserByEmail(email);

    if (!zitadelUser) {
      const existingUser = await this.repository.user.getByEmail(email);
      return {
        next: registrationSteps.FORM,
        user: existingUser,
        accountStatus: registrationAccountStatuses.NEW,
      };
    }

    return { next: registrationSteps.LOGIN };
  }

  async checkAuthenticatedUser(
    user: RequestHydratedUser,
    withFormData: boolean,
  ): Promise<RegistrationFormStep | RegistrationCompletedStep> {
    if (!user.id) {
      const zitadelUser = withFormData
        ? {
            email: user.email,
            firstName: user.givenName,
            lastName: user.familyName,
            nickname: user.nickname,
            mobilePhone: user.phoneNumber,
            birthDate: user.birthDate,
          }
        : undefined;
      return {
        next: registrationSteps.FORM,
        user: zitadelUser,
        accountStatus: registrationAccountStatuses.EXISTING,
      };
    }

    if (user.can(BE_AFFECTED)) {
      return { next: registrationSteps.COMPLETED };
    }

    const hasValidApplication =
      await this.repository.application.hasValidApplication(user.id);
    if (hasValidApplication) {
      return { next: registrationSteps.COMPLETED };
    }

    const existingUser = withFormData
      ? await this.repository.user.getById(user.id)
      : undefined;
    return {
      next: registrationSteps.FORM,
      user: existingUser,
      accountStatus: registrationAccountStatuses.EXISTING,
    };
  }

  async register(
    fulfilledRegistration: FulfilledRegistration,
    token?: string,
  ): Promise<void> {
    const isValidRegistration = token
      ? checkStaffInvitationTokenValidity(token)
      : true;

    if (!isValidRegistration) {
      throw new BadRequestException("Le lien d'invitation a expiré");
    }

    const membership = this.getMembership(token);

    const zitadelUserPromise = isNewAccountRegistration(fulfilledRegistration)
      ? this.createZitadelUser(fulfilledRegistration)
      : this.updateZitadelUser(fulfilledRegistration);

    const [registree, _] = await Promise.all([
      this.member.register.fromRegisterForm(fulfilledRegistration, membership),
      zitadelUserPromise,
    ]);

    if (token) await this.member.applyFor.staff({ email: registree.email });
    else await this.member.applyFor.volunteer({ email: registree.email });

    this.publishNewcomerRegisteredEvent(registree);
  }

  private getMembership(token?: string): Membership {
    return token ? STAFF : VOLUNTEER;
  }

  private async createZitadelUser(form: NewAccountFulfilledRegistration) {
    const newZitadelUser = await this.service.zitadel.createZitadelUser({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      nickname: form.nickname,
      phoneNumber: form.mobilePhone,
      dateOfBirth: form.birthDate,
    });
    return this.repository.user.updateZitadelIdByEmail(
      form.email,
      newZitadelUser.userId,
    );
  }

  private async updateZitadelUser(form: ExistingAccountFulfilledRegistration) {
    const zitadelId =
      (await this.repository.user.getZitadelIdByEmail(form.email)) ??
      (await this.service.zitadel.getZitadelUserByEmail(form.email)).userId;

    return this.service.zitadel.updateZitadelUser(zitadelId, {
      firstName: form.firstName,
      lastName: form.lastName,
      nickname: form.nickname,
      phoneNumber: form.mobilePhone,
      dateOfBirth: form.birthDate,
    });
  }

  private publishNewcomerRegisteredEvent(
    registree: NewcomerRegistered<Membership>,
  ) {
    if (isStaffRegistered(registree)) {
      return this.service.event.publish({
        type: STAFF_REGISTERED,
        data: registree,
      });
    }

    if (isVolunteerRegistered(registree)) {
      return this.service.event.publish({
        type: VOLUNTEER_REGISTERED,
        data: registree,
      });
    }
  }

  async forgetMe(credentials: Credentials, token: string) {
    const isValidForgetRequest = this.checkForgetRequestValidity(
      token,
      credentials.email,
    );

    if (!isValidForgetRequest) {
      throw new BadRequestException(
        "Le lien d'oubli ne semble pas être le bon. Tu peux en redemander un.",
      );
    }

    await this.member.forget.me(credentials);
  }

  async forgetHim(email: string) {
    return this.member.forget.him(email);
  }

  private checkForgetRequestValidity(token: string, email: string) {
    try {
      const verifyOptions = { ignoreExpiration: false };
      const payload = jwt.verify(token, jwtConstants.secret, verifyOptions);

      if (isString(payload)) return false;

      return payload.email === email;
    } catch {
      return false;
    }
  }
}
