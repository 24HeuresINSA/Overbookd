import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GrantPermissionRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    description: "The the team to grant the permission to",
  })
  @IsString()
  @IsNotEmpty()
  team: string;
}
