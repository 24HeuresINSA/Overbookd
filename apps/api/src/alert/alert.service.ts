import type { Alerts } from "@overbookd/alerts";
import { PersonalAccountAlerting } from "@overbookd/personal-account";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";
import { SettleAlerting } from "@overbookd/contribution";

export class AlertService {
  constructor(
    private readonly personalAccountAlerting: PersonalAccountAlerting,
    private readonly contributionAlerting: SettleAlerting,
  ) {}

  async getMyAlerts(volunteer: JwtPayload): Promise<Alerts> {
    console.error(typeof volunteer.id);
    const [personalAccount, contribution] = await Promise.all([
      this.personalAccountAlerting.for(volunteer.id),
      this.contributionAlerting.for(volunteer.id),
    ]);
    return { personalAccount, contribution };
  }
}
