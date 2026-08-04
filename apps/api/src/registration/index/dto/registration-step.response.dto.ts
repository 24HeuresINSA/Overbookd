import { ApiProperty } from "@nestjs/swagger";
import { RegistrationFormStepUser, registrationSteps } from "@overbookd/http";
import { RegistrationTeams } from "@overbookd/registration";
import { UserNameResponseDto } from "../../../common/dto/user-name.response.dto";

class RegistrationFormStepUserResponseDto
  extends UserNameResponseDto
  implements RegistrationFormStepUser
{
  @ApiProperty({
    required: false,
    description: "user email",
    type: String,
  })
  email?: string;

  @ApiProperty({
    required: false,
    description: "user mobile phone number",
    type: String,
  })
  mobilePhone?: string;

  @ApiProperty({
    required: false,
    description: "user birth date",
    type: Date,
  })
  birthDate?: Date;

  @ApiProperty({
    required: false,
    description: "user comment",
    type: String,
  })
  comment?: string;

  @ApiProperty({
    required: false,
    description: "user teams",
    type: String,
    isArray: true,
  })
  teams?: RegistrationTeams;
}

export class RegistrationFormStepResponseDto {
  @ApiProperty({
    required: true,
    description: "next registration step",
    type: String,
  })
  next: typeof registrationSteps.FORM;

  @ApiProperty({
    required: false,
    description: "user information",
    type: RegistrationFormStepUserResponseDto,
  })
  user?: RegistrationFormStepUserResponseDto;
}

export class RegistrationLoginStepResponseDto {
  @ApiProperty({
    required: true,
    description: "next registration step",
    type: String,
  })
  next: typeof registrationSteps.LOGIN;
}
