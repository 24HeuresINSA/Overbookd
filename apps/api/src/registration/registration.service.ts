import {
  ADHERENT,
  FulfilledRegistration,
  NewcomerRegisteredEvent,
  RegisterNewcomer,
  Registree,
  VOLUNTEER,
} from "@overbookd/registration";
import { jwtConstants } from "../authentication/constants";
import { InviteNewAdherents } from "@overbookd/registration";
import { BadRequestException } from "@nestjs/common";
import { DomainEventService } from "../domain-event/domain-event.service";

export class RegistrationService {
  constructor(
    private readonly registerNewcomer: RegisterNewcomer,
    private readonly eventStore: DomainEventService,
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
}
