import { ENROLL_NEWCOMER } from "@overbookd/permission";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";

export class NotificationService {
  async hasNotifications(user: JwtPayload): Promise<boolean> {
    return user.permissions.includes(ENROLL_NEWCOMER);
  }
}
