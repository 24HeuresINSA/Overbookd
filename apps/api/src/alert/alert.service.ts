import {
  IAlertAboutPersonnalAccount,
  PersonnalAccountAlerting,
} from "@overbookd/personnal-account";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";

export class AlertService {
  constructor(private readonly alerting: PersonnalAccountAlerting) {}

  async getMyAlerts(
    volunteer: JwtPayload,
  ): Promise<IAlertAboutPersonnalAccount[]> {
    const alert = await this.alerting.for(volunteer.id);
    return alert ? [alert] : [];
  }
}
