import type { Alerts } from "@overbookd/alerts";
import { PersonalAccountAlerting } from "@overbookd/personal-account";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";
import { SettleAlerting } from "@overbookd/contribution";
import { User } from "@overbookd/user";
import { AvailabilitiesAlerting } from "@overbookd/volunteer-availability";

export type ProfilePictureAlerting = {
  for(id: User["id"]): Promise<boolean>;
};

export class AlertService {
  constructor(
    private readonly personalAccountAlerting: PersonalAccountAlerting,
    private readonly contributionAlerting: SettleAlerting,
    private readonly profilePictureAlerting: ProfilePictureAlerting,
    private readonly availabilitiesAlerting: AvailabilitiesAlerting,
  ) {}

  async getMyAlerts(volunteer: JwtPayload): Promise<Alerts> {
    const [personalAccount, contribution, profilePicture, availabilities] =
      await Promise.all([
        this.personalAccountAlerting.for(volunteer.id),
        this.contributionAlerting.for(volunteer.id),
        this.profilePictureAlerting.for(volunteer.id),
        this.availabilitiesAlerting.for(volunteer.id),
      ]);
    return { personalAccount, contribution, profilePicture, availabilities };
  }
}
