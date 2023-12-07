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
import { IsEnum, IsString } from "class-validator";
import { Rejection } from "../festival-activity.service";

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
    message: () => `❌ Seuls ${reviewers.join(", ")} peuvent approuver une FA`,
  })
  team: Reviewer;
}

export class RejectRequestDto implements Rejection {
  @ApiProperty({ required: true, enum: reviewers })
  @IsEnum(reviewers, {
    message: () => `❌ Seuls ${reviewers.join(", ")} peuvent rejetter une FA`,
  })
  team: Reviewer;

  @ApiProperty({
    required: true,
    description: "Explain why festival activity has been rejected",
  })
  @IsString()
  reason: string;
}
