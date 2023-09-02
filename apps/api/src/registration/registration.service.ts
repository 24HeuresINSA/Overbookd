import {
  FulfilledRegistration,
  RegisterNewcomer,
} from "@overbookd/registration";
import { jwtConstants } from "../authentication/constants";
import { InviteNewAdherents } from "@overbookd/registration";
import { BadRequestException } from "@nestjs/common";

export class RegistrationService {
  constructor(private readonly registerNewcomer: RegisterNewcomer) {}

  async register(
    fulfilledRegistration: FulfilledRegistration,
    token?: string,
  ): Promise<void> {
    const isValidRegistration = this.checkInvitationValidity(token);

    if (!isValidRegistration) {
      throw new BadRequestException("Le lien d'invitation a exipré");
    }

    await this.registerNewcomer.fromRegisterForm(fulfilledRegistration);
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
