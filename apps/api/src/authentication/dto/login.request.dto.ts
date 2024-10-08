import { ApiProperty } from "@nestjs/swagger";
import { UserCredentials } from "@overbookd/http";
import { Transform } from "class-transformer";
import { IsDefined, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginRequestDto implements UserCredentials {
  @ApiProperty({
    required: true,
    description: "The email of the user",
    example: "admin@24h.me",
  })
  @IsDefined()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({
    required: true,
    description: "The password of the user",
    example: "password",
  })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  password: string;
}
