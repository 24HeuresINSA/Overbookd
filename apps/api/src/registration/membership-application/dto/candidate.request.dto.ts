import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CandidateRequestDto {
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
