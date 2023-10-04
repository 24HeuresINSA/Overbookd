import {
  IAlertAboutPersonalAccount,
  PersonalAccountAlerting,
} from "@overbookd/personal-account";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";

export class AlertService {
  constructor(private readonly alerting: PersonalAccountAlerting) {}

  async getMyAlerts(
    volunteer: JwtPayload,
  ): Promise<IAlertAboutPersonalAccount[]> {
    const alert = await this.alerting.for(volunteer.id);
    return alert ? [alert] : [];
  }
}
