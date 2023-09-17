import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { RefreshAccessRequest } from "../authentication.model";

export class RefreshAccessRequestDto implements RefreshAccessRequest {
  @ApiProperty({
    description: "User refresh token",
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
