import { ApiProperty } from "@nestjs/swagger";
import { Reviewer } from "@overbookd/festival-event";
import { ReviewRejection } from "@overbookd/http";
import {
  BARRIERES,
  COMMUNICATION,
  HUMAIN,
  LOG_ELEC,
  LOG_MATOS,
  SECU,
  SIGNA,
} from "@overbookd/team-constants";
import { IsEnum, IsString } from "class-validator";

const reviewers: Reviewer<"FA">[] = [
  HUMAIN,
  LOG_MATOS,
  LOG_ELEC,
  BARRIERES,
  SECU,
  SIGNA,
  COMMUNICATION,
];

export class ApproveActivityRequestDto {
  @ApiProperty({ required: true, enum: reviewers })
  @IsEnum(reviewers, {
    message: () => `Seuls ${reviewers.join(", ")} peuvent approuver une FA`,
  })
  team: Reviewer<"FA">;
}

export class RejectActivityRequestDto implements ReviewRejection<"FA"> {
  @ApiProperty({ required: true, enum: reviewers })
  @IsEnum(reviewers, {
    message: () => `Seuls ${reviewers.join(", ")} peuvent rejeter une FA`,
  })
  team: Reviewer<"FA">;

  @ApiProperty({
    required: true,
    description: "Explain why festival activity has been rejected",
  })
  @IsString()
  reason: string;
}
