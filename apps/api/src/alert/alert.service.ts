import type { Alerts } from "@overbookd/alerts";
import { PersonalAccountAlerting } from "@overbookd/personal-account";
import { SettleAlerting } from "@overbookd/contribution";
import { User } from "@overbookd/user";
import { RequestHydratedUser } from "../authentication-zitadel/request-hydrated-user";

export type ProfilePictureAlerting = {
  for(id: User["id"]): Promise<boolean>;
};
export type FriendsAlerting = {
  for(id: User["id"]): Promise<boolean>;
};
export type NotYetVolunteerAlerting = {
  for(id: User["id"]): Promise<boolean>;
};

type Alerting = {
  personalAccount: Readonly<PersonalAccountAlerting>;
  contribution: Readonly<SettleAlerting>;
  profilePicture: Readonly<ProfilePictureAlerting>;
  friends: Readonly<FriendsAlerting>;
  notYetVolunteer: Readonly<NotYetVolunteerAlerting>;
};

export class AlertService {
  constructor(private readonly alert: Alerting) {}

  async getMyAlerts(volunteer: RequestHydratedUser): Promise<Alerts> {
    const [
      personalAccount,
      contribution,
      profilePicture,
      friends,
      notYetVolunteer,
    ] = await Promise.all([
      this.alert.personalAccount.for(volunteer.id),
      this.alert.contribution.for(volunteer.id),
      this.alert.profilePicture.for(volunteer.id),
      this.alert.friends.for(volunteer.id),
      this.alert.notYetVolunteer.for(volunteer.id),
    ]);
    return {
      personalAccount,
      contribution,
      profilePicture,
      friends,
      notYetVolunteer,
    };
  }
}
