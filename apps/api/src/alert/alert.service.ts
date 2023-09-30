import {
  PersonnalAccountAlert,
  InDebtAlerting,
} from "@overbookd/personnal-account";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";

export class AlertService {
  constructor(private readonly inDebtAlert: InDebtAlerting) {}

  async getMyAlerts(volunteer: JwtPayload): Promise<PersonnalAccountAlert[]> {
    const inDebt = await this.inDebtAlert.for(volunteer.id);
    return inDebt ? [inDebt] : [];
  }
}
