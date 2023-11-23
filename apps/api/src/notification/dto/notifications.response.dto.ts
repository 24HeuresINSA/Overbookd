import { ApiProperty } from "@nestjs/swagger";
import { Notifications } from "../notification.service";

export class NotificationsResponseDto implements Notifications {
  @ApiProperty({})
  hasNotifications: boolean;
}
