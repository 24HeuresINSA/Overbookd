import { ApiProperty } from "@nestjs/swagger";
import {
  Reviewer,
  barrieres,
  communication,
  elec,
  humain,
  matos,
  secu,
  signa,
} from "@overbookd/festival-activity";
import { IsEnum } from "class-validator";

const reviewers: Reviewer[] = [
  humain,
  matos,
  elec,
  barrieres,
  secu,
  signa,
  communication,
];

export class ApproveRequestDto {
  @ApiProperty({ required: true, enum: reviewers })
  @IsEnum(reviewers, {
    message: () => `❌ Seuls ${reviewers.join(", ")} peuvent approver une FA`,
  })
  team: Reviewer;
}
