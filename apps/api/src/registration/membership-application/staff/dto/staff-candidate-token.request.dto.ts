import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class StaffCandidateTokenRequestDto {
  @ApiProperty({
    description: "Application's token",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
