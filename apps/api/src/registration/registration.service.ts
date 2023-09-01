import {
  FulfilledRegistration,
  RegisterNewcomer,
} from "@overbookd/registration";

export class RegistrationService {
  constructor(private readonly registerNewcomer: RegisterNewcomer) {}

  async register(fulfilledRegistration: FulfilledRegistration): Promise<void> {
    await this.registerNewcomer.fromRegisterForm(fulfilledRegistration);
  }
}
