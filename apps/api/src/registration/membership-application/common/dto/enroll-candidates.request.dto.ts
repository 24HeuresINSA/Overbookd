import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDefined } from "class-validator";
import {
  EnrollCandidatesForm,
  CandidateToEnroll,
} from "@overbookd/registration";

class CandidateToEnrollDto implements CandidateToEnroll {
  @ApiProperty({ required: true })
  id: number;
}

export class EnrollCandidatesRequestDto
  implements Pick<EnrollCandidatesForm, "candidates">
{
  @ApiProperty({
    required: true,
    description: "Candidates to enroll",
    type: CandidateToEnrollDto,
    isArray: true,
  })
  @IsDefined()
  @IsArray()
  candidates: CandidateToEnroll[];
}
