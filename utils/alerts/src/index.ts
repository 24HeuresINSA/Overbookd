import type { IAlertAboutPersonalAccount } from "@overbookd/personal-account";
import type { IAlertAboutContribution } from "@overbookd/contribution";

export type Alerts = {
  personalAccount?: IAlertAboutPersonalAccount;
  contribution?: IAlertAboutContribution;
  profilePicture?: boolean;
  friends?: boolean;
  notYetVolunteer?: boolean;
};
