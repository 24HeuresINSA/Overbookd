import type { IAlertAboutContribution } from "@overbookd/contribution";
import type { IAlertAboutPersonalAccount } from "@overbookd/personal-account";

export type Alerts = {
  personalAccount?: IAlertAboutPersonalAccount;
  contribution?: IAlertAboutContribution;
  profilePicture?: boolean;
  friends?: boolean;
  notYetVolunteer?: boolean;
};
