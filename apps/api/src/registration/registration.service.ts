import jwt from "jsonwebtoken";
import { Injectable, BadRequestException } from "@nestjs/common";
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
} from "@overbookd/registration";
import { jwtConstants } from "../authentication/constants";
import { InviteNewAdherents } from "@overbookd/registration";
import { DomainEventService } from "../domain-event/domain-event.service";
import { EnrollNewcomersRepository } from "./repository/enroll-newcomers.repository";

@Injectable()
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
    const membership = token ? ADHERENT : VOLUNTEER;

    this.eventStore.publish({
      domain: "registration",
      event: NewcomerRegisteredEvent.create(registree, membership),
    });
  }

  private checkInvitationValidity(token?: string) {
    if (!token) return true;

    return InviteNewAdherents.isInvitationValid({
      token,
      secret: jwtConstants.secret,
    });
  }

  invite(): URL {
    const domain = process.env.DOMAIN;
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

  async forget(credentials: Credentials, token: string) {
    const isValidForgetRequest = this.checkForgetRequestValidity(token);

    if (!isValidForgetRequest) {
      throw new BadRequestException("Le lien d'oubli a exipré");
    }

    await this.forgetMember.with(credentials);
  }

  private checkForgetRequestValidity(token: string) {
    try {
      jwt.verify(token, jwtConstants.secret, { ignoreExpiration: false });
      return true;
    } catch {
      return false;
    }
  }
}
