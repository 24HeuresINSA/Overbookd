import jwt from "jsonwebtoken";
import { BadRequestException } from "@nestjs/common";
import {
  FulfilledRegistration,
  RegisterNewcomer,
  VOLUNTEER,
  STAFF,
  Credentials,
  ForgetMember,
  Membership,
  NewcomerRegistered,
  isStaffRegistered,
  isVolunteerRegistered,
} from "@overbookd/registration";
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
  RegistrationStep,
  RegistrationFormStepUser,
} from "@overbookd/http";

type Member = {
  forget: Readonly<ForgetMember>;
  register: Readonly<RegisterNewcomer>;
};

type Service = {
  event: Readonly<DomainEventService>;
  zitadel: Readonly<ZitadelService>;
};

export type UserForRegistrationRepository = {
  getByEmail: (email: string) => Promise<RegistrationFormStepUser>;
};

type Repository = {
  user: Readonly<UserForRegistrationRepository>;
};

export class RegistrationService {
  constructor(
    private readonly member: Member,
    private readonly service: Service,
    private readonly repository: Repository,
  ) {}

  async check(email: string): Promise<RegistrationStep> {
    email = email.toLowerCase().trim();
    const zitadelUser = await this.service.zitadel.getZitadelUserByEmail(email);

    const existingUser = await this.repository.user.getByEmail(email);
    if (!zitadelUser) {
      return { next: registrationSteps.FORM, user: existingUser };
    }

    if (!existingUser) {
      const stepUser: RegistrationFormStepUser = {
        email: zitadelUser.human.email.email,
        firstName: zitadelUser.human.profile.givenName,
        lastName: zitadelUser.human.profile.familyName,
        nickname: zitadelUser.human.profile.nickName,
        mobilePhone: zitadelUser.human.phone.phone,
      };
      return { next: registrationSteps.FORM, user: stepUser };
    }

    return { next: registrationSteps.LOGIN };
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
