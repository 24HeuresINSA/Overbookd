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
import { jwtConstants } from "../../authentication/jwt-constants";
import { InviteStaff } from "@overbookd/registration";
import { DomainEventService } from "../../domain-event/domain-event.service";
import { isString } from "class-validator";
import {
  STAFF_REGISTERED,
  VOLUNTEER_REGISTERED,
} from "@overbookd/domain-events";
import { VolunteerAvailabilityService } from "../../volunteer-availability/volunteer-availability.service";

type Member = {
  forget: Readonly<ForgetMember>;
  register: Readonly<RegisterNewcomer>;
};

type Service = {
  event: Readonly<DomainEventService>;
  availability: Readonly<VolunteerAvailabilityService>;
};

export class RegistrationService {
  constructor(
    private readonly member: Member,
    private readonly service: Service,
  ) {}

  async register(
    fulfilledRegistration: FulfilledRegistration,
    token?: string,
  ): Promise<void> {
    const isValidRegistration = this.checkInvitationValidity(token);

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

  private checkInvitationValidity(token?: string) {
    if (!token) return true;

    return InviteStaff.isInvitationValid({
      token,
      secret: jwtConstants.secret,
    });
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
