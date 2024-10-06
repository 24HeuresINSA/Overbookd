import { ApiProperty } from "@nestjs/swagger";
import { StaffApplication } from "@overbookd/http";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CandidateRequestDto implements StaffApplication {
  @ApiProperty({
    description: "Candidate's email",
    example: "candidate@24h.me",
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Application's token",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
