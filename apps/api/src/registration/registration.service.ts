import jwt from "jsonwebtoken";
import { BadRequestException } from "@nestjs/common";
import {
  EnrollNewcomersForm,
  FulfilledRegistration,
  IDefineANewcomer,
  NewcomerRegisteredEvent,
  RegisterNewcomer,
  Registree,
  VOLUNTEER,
  ADHERENT,
  EnrollNewcomers,
  Credentials,
  ForgetMember,
  ADHERENT_REGISTERED,
  VOLUNTEER_REGISTERED,
} from "@overbookd/registration";
import { jwtConstants } from "../authentication/constants";
import { InviteNewAdherents } from "@overbookd/registration";
import { DomainEventService } from "../domain-event/domain-event.service";
import { EnrollNewcomersRepository } from "./repository/enroll-newcomers.repository";
import { isString } from "class-validator";
import { DomainEvent } from "@overbookd/domain-events";

export class RegistrationService {
  constructor(
    private readonly enrollNewcomersRepository: EnrollNewcomersRepository,
    private readonly registerNewcomer: RegisterNewcomer,
    private readonly eventStore: DomainEventService,
    private readonly forgetMember: ForgetMember,
  ) {}

  async register(
    fulfilledRegistration: FulfilledRegistration,
    token?: string,
  ): Promise<void> {
    const isValidRegistration = this.checkInvitationValidity(token);

    if (!isValidRegistration) {
      throw new BadRequestException("Le lien d'invitation a exipré");
    }

    const registree = await this.registerNewcomer.fromRegisterForm(
      fulfilledRegistration,
    );

    this.publishNewcomerRegisteredEvent(registree, token);
  }

  private publishNewcomerRegisteredEvent(registree: Registree, token?: string) {
    const event: DomainEvent = token
      ? {
          type: ADHERENT_REGISTERED,
          data: NewcomerRegisteredEvent.create(registree, ADHERENT),
        }
      : {
          type: VOLUNTEER_REGISTERED,
          data: NewcomerRegisteredEvent.create(registree, VOLUNTEER),
        };

    this.eventStore.publish(event);
  }

  private checkInvitationValidity(token?: string) {
    if (!token) return true;

    return InviteNewAdherents.isInvitationValid({
      token,
      secret: jwtConstants.secret,
    });
  }

  invite(): URL {
    const domain = process.env.DOMAIN ?? "";
    const secret = jwtConstants.secret;
    return InviteNewAdherents.byLink({ domain, secret });
  }

  async getNewcomers(): Promise<IDefineANewcomer[]> {
    return this.enrollNewcomersRepository.findEnrollable();
  }

  async enrollNewcomers({
    newcomers,
    team,
  }: EnrollNewcomersForm): Promise<void> {
    const newcomersToEnroll = EnrollNewcomers.with(newcomers).to(team);
    await this.enrollNewcomersRepository.enroll(newcomersToEnroll);
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

    await this.forgetMember.forgetMe(credentials);
  }

  async forgetHim(email: string) {
    return this.forgetMember.forgetHim(email);
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
