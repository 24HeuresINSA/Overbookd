import type { Alerts } from "@overbookd/alerts";
import { PersonalAccountAlerting } from "@overbookd/personal-account";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";
import { SettleAlerting } from "@overbookd/contribution";
import { User } from "@overbookd/user";

export type ProfilePictureAlerting = {
  for(id: User["id"]): Promise<boolean>;
};
export type FriendsAlerting = {
  for(id: User["id"]): Promise<boolean>;
};

export class AlertService {
  constructor(
    private readonly personalAccountAlerting: PersonalAccountAlerting,
    private readonly contributionAlerting: SettleAlerting,
    private readonly profilePictureAlerting: ProfilePictureAlerting,
    private readonly friendsAlerting: FriendsAlerting,
  ) {}

  async getMyAlerts(volunteer: JwtPayload): Promise<Alerts> {
    const [personalAccount, contribution, profilePicture, friends] =
      await Promise.all([
        this.personalAccountAlerting.for(volunteer.id),
        this.contributionAlerting.for(volunteer.id),
        this.profilePictureAlerting.for(volunteer.id),
        this.friendsAlerting.for(volunteer.id),
      ]);
    return { personalAccount, contribution, profilePicture, friends };
  }
}
