import {
  FulfilledRegistration,
  RegisterNewcomer,
} from "@overbookd/registration";
import { jwtConstants } from "../authentication/constants";
import { InviteNewAdherents } from "@overbookd/registration";

export class RegistrationService {
  constructor(private readonly registerNewcomer: RegisterNewcomer) {}

  async register(fulfilledRegistration: FulfilledRegistration): Promise<void> {
    await this.registerNewcomer.fromRegisterForm(fulfilledRegistration);
  }

  invite(): URL {
    const domain = process.env.DOMAIN;
    const secret = jwtConstants.secret;
    return InviteNewAdherents.byLink({ domain, secret });
  }
}
