import { ApiProperty } from "@nestjs/swagger";
import { RegistrationFormStepUser, registrationSteps } from "@overbookd/http";
import {
  RegistrationTeams,
  PasswordRequirement,
} from "@overbookd/registration";

class RegistrationFormStepUserResponseDto implements RegistrationFormStepUser {
  @ApiProperty({
    required: false,
    description: "user first name",
    type: String,
  })
  firstName?: string;

  @ApiProperty({
    required: false,
    description: "user last name",
    type: String,
  })
  lastName?: string;

  @ApiProperty({
    required: false,
    description: "user nickname",
    type: String,
  })
  nickname?: string;

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

  @ApiProperty({
    required: true,
    description: "password requirement for registration",
    type: String,
  })
  passwordRequirement: PasswordRequirement;
}

export class RegistrationLoginStepResponseDto {
  @ApiProperty({
    required: true,
    description: "next registration step",
    type: String,
  })
  next: typeof registrationSteps.LOGIN;
}

export class RegistrationCompletedStepResponseDto {
  @ApiProperty({
    required: true,
    description: "next registration step",
    type: String,
  })
  next: typeof registrationSteps.COMPLETED;
}
