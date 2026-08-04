import { ApiProperty } from "@nestjs/swagger";
import { RegistrationFormStepUser, registrationSteps } from "@overbookd/http";
import { UserNameResponseDto } from "../../../common/dto/user-name.response.dto";

class RegistrationFormStepUserResponseDto
  extends UserNameResponseDto
  implements RegistrationFormStepUser
{
  @ApiProperty({
    required: true,
    description: "user teams",
    type: String,
    isArray: true,
  })
  teams: string[];
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
