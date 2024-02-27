import type { IAlertAboutPersonalAccount } from "@overbookd/personal-account";
import type { IAlertAboutContribution } from "@overbookd/contribution";
import type { IAlertAboutAvailabilities } from "@overbookd/volunteer-availability";

export type Alerts = {
  personalAccount?: IAlertAboutPersonalAccount;
  contribution?: IAlertAboutContribution;
  profilePicture?: boolean;
  availabilities?: IAlertAboutAvailabilities;
};
