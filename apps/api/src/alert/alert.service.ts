import { Alert, InDebtAlerting } from "@overbookd/personnal-account";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";

export class AlertService {
  constructor(private readonly inDebtAlert: InDebtAlerting) {}

  async getMyAlerts(volunteer: JwtPayload): Promise<Alert[]> {
    const inDebt = await this.inDebtAlert.for(volunteer.id);
    return inDebt ? [inDebt] : [];
  }
}
