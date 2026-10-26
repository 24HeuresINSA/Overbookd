import type { Alerts } from "@overbookd/alerts";
import { PersonalAccountAlerting } from "@overbookd/personal-account";
import { SettleAlerting } from "@overbookd/contribution";
import { RequestHydratedUser } from "../authentication-zitadel/request-hydrated-user";

type Alerting = {
  personalAccount: Readonly<PersonalAccountAlerting>;
  contribution: Readonly<SettleAlerting>;
};

export class AlertService {
  constructor(private readonly alert: Alerting) {}

  async getMyAlerts(volunteer: RequestHydratedUser): Promise<Alerts> {
    const [personalAccount, contribution] = await Promise.all([
      this.alert.personalAccount.for(volunteer.id),
      this.alert.contribution.for(volunteer.id),
    ]);
    return {
      personalAccount,
      contribution,
      profilePicture: !volunteer?.profilePicture,
    };
  }
}
