import { BadRequestException } from "@nestjs/common";
import {
  FulfilledRegistration,
  RegisterNewcomer,
  VOLUNTEER,
  STAFF,
  Membership,
  NewcomerRegistered,
  isStaffRegistered,
  isVolunteerRegistered,
  PASSWORD_REQUIRED,
  PASSWORD_NOT_REQUIRED,
} from "@overbookd/registration";
import { BE_AFFECTED } from "@overbookd/permission";
import { DomainEventService } from "../../domain-event/domain-event.service";
import {
  STAFF_REGISTERED,
  VOLUNTEER_REGISTERED,
} from "@overbookd/domain-events";
import { checkStaffInvitationTokenValidity } from "../membership-application/staff/jwt.utils";
import { ZitadelService } from "../../user/zitadel.service";
import {
  registrationSteps,
  RegistrationFormStep,
  RegistrationLoginStep,
  RegistrationCompletedStep,
  RegistrationFormStepUser,
} from "@overbookd/http";
import { RequestHydratedUser } from "../../authentication-zitadel/request-hydrated-user";

type Member = {
  register: Readonly<RegisterNewcomer>;
};

type Service = {
  event: Readonly<DomainEventService>;
  zitadel: Readonly<ZitadelService>;
};

export type UserForRegistrationRepository = {
  getByEmail: (email: string) => Promise<RegistrationFormStepUser>;
  getById: (id: number) => Promise<RegistrationFormStepUser>;
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
  ): Promise<RegistrationLoginStep | RegistrationFormStep> {
    email = email.toLowerCase().trim();
    const zitadelUser = await this.service.zitadel.getZitadelUserByEmail(email);

    if (!zitadelUser) {
      const existingUser = await this.repository.user.getByEmail(email);
      return {
        next: registrationSteps.FORM,
        user: existingUser,
        passwordRequirement: PASSWORD_REQUIRED,
      };
    }

    return { next: registrationSteps.LOGIN };
  }

  async checkAuthenticatedUser(
    user: RequestHydratedUser,
  ): Promise<RegistrationFormStep | RegistrationCompletedStep> {
    if (!user.id) {
      const zitadelUser = await this.service.zitadel.getZitadelUserById(
        user.zitadelId,
      );
      const { email, profile, phone } = zitadelUser.human;
      const stepUser: RegistrationFormStepUser = {
        email: email.email,
        firstName: profile.givenName,
        lastName: profile.familyName,
        nickname: profile.nickName,
        mobilePhone: phone.phone,
      };
      return {
        next: registrationSteps.FORM,
        user: stepUser,
        passwordRequirement: PASSWORD_NOT_REQUIRED,
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

    const existingUser = await this.repository.user.getById(user.id);
    return {
      next: registrationSteps.FORM,
      user: existingUser,
      passwordRequirement: PASSWORD_NOT_REQUIRED,
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

    const registree = await this.member.register.fromRegisterForm(
      fulfilledRegistration,
      membership,
      PASSWORD_REQUIRED,
    );

    this.publishNewcomerRegisteredEvent(registree);
  }

  private getMembership(token?: string): Membership {
    return token ? STAFF : VOLUNTEER;
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
}
