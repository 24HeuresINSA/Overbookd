import jwt from "jsonwebtoken";
import { BadRequestException } from "@nestjs/common";
import {
  EnrollNewcomersForm,
  FulfilledRegistration,
  RegisterNewcomer,
  VOLUNTEER,
  STAFF,
  EnrollNewcomers,
  Credentials,
  ForgetMember,
  Membership,
  NewcomerRegistered,
  isStaffRegistered,
  isVolunteerRegistered,
} from "@overbookd/registration";
import { jwtConstants } from "../authentication/constants";
import { InviteStaff } from "@overbookd/registration";
import { DomainEventService } from "../domain-event/domain-event.service";
import { EnrollNewcomersRepository } from "./repository/enroll-newcomers.repository";
import { isString } from "class-validator";
import {
  STAFF_REGISTERED,
  VOLUNTEER_REGISTERED,
} from "@overbookd/domain-events";
import { EnrollableStaff, EnrollableVolunteer } from "@overbookd/http";
import { IProvidePeriod, OverDate } from "@overbookd/period";
import { VolunteerAvailabilityService } from "../volunteer-availability/volunteer-availability.service";

type Member = {
  forget: Readonly<ForgetMember>;
  register: Readonly<RegisterNewcomer>;
};

type Service = {
  event: Readonly<DomainEventService>;
  availability: Readonly<VolunteerAvailabilityService>;
};

const VOLUNTEER_BRIEFING_DATE = "2024-05-13";
const VOLUNTEER_BRIEFING_START_HOUR = 18;
const VOLUNTEER_BRIEFING_END_HOUR = 20;

const VOLUNTEER_BRIEFING_START = OverDate.init({
  date: VOLUNTEER_BRIEFING_DATE,
  hour: VOLUNTEER_BRIEFING_START_HOUR,
}).date;

const VOLUNTEER_BRIEFING_END = OverDate.init({
  date: VOLUNTEER_BRIEFING_DATE,
  hour: VOLUNTEER_BRIEFING_END_HOUR,
}).date;

const VOLUNTEER_BRIEFING_PERIOD: IProvidePeriod = {
  start: VOLUNTEER_BRIEFING_START,
  end: VOLUNTEER_BRIEFING_END,
};

export class RegistrationService {
  constructor(
    private readonly enrollNewcomersRepository: EnrollNewcomersRepository,
    private readonly member: Member,
    private readonly service: Service,
  ) {}

  async register(
    fulfilledRegistration: FulfilledRegistration,
    token?: string,
  ): Promise<void> {
    const isValidRegistration = this.checkInvitationValidity(token);

    if (!isValidRegistration) {
      throw new BadRequestException("Le lien d'invitation a exipré");
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

  invite(): URL {
    const domain = process.env.DOMAIN ?? "";
    const secret = jwtConstants.secret;
    return InviteStaff.byLink({ domain, secret });
  }

  getStaffs(): Promise<EnrollableStaff[]> {
    return this.enrollNewcomersRepository.findEnrollableStaffs();
  }

  getVolunteers(): Promise<EnrollableVolunteer[]> {
    return this.enrollNewcomersRepository.findEnrollableVolunteers();
  }

  getVolunteer(
    volunteerId: EnrollableVolunteer["id"],
  ): Promise<EnrollableVolunteer> {
    return this.enrollNewcomersRepository.findEnrollableVolunteer(volunteerId);
  }

  async enrollNewcomers({
    newcomers,
    team,
  }: EnrollNewcomersForm): Promise<void> {
    const newcomersToEnroll = EnrollNewcomers.with(newcomers).to(team);
    await this.enrollNewcomersRepository.enroll(newcomersToEnroll);
    if (team !== "soft") return;

    await Promise.all(
      newcomersToEnroll.map(({ id }) =>
        this.service.availability.addAvailabilities(id, [
          VOLUNTEER_BRIEFING_PERIOD,
        ]),
      ),
    );
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
