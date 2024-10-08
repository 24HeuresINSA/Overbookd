import { ApiProperty } from "@nestjs/swagger";
import { UserAccess } from "@overbookd/http";

export class UserAccessResponseDto implements UserAccess {
  @ApiProperty({
    description: "User access token",
  })
  accessToken: string;

  @ApiProperty({
    description: "User refresh token",
  })
  refreshToken: string;
}
