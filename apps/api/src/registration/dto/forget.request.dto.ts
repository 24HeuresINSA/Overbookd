import { ApiProperty } from "@nestjs/swagger";
import { Credentials } from "@overbookd/registration";
import { Type } from "class-transformer";
import { IsDefined, IsEmail, IsString, ValidateNested } from "class-validator";

class CredentialsRepresentation implements Credentials {
  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  password: string;
}

export class ForgetRequestDto {
  @ApiProperty({ required: false })
  @IsDefined()
  @IsString()
  token: string;

  @ApiProperty({ type: CredentialsRepresentation })
  @Type(() => CredentialsRepresentation)
  @ValidateNested()
  credentials: Credentials;
}
