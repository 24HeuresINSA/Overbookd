import { ApiProperty } from "@nestjs/swagger";
import { Reviewer } from "@overbookd/festival-event";
import {
  ReviewApproval,
  ReviewIgnoreTask,
  ReviewRejection,
} from "@overbookd/http";
import { HUMAIN, LOG_ELEC, LOG_MATOS } from "@overbookd/team-constants";
import { IsEnum, IsString } from "class-validator";

const reviewers: Reviewer<"FT">[] = [HUMAIN, LOG_MATOS, LOG_ELEC];

export class RejectTaskRequestDto implements ReviewRejection<"FT"> {
  @ApiProperty({ required: true, enum: reviewers })
  @IsEnum(reviewers, {
    message: () => `Seuls ${reviewers.join(", ")} peuvent rejeter une FT`,
  })
  team: Reviewer<"FT">;

  @ApiProperty({
    required: true,
    description: "Explain why festival task has been rejected",
  })
  @IsString()
  reason: string;
}

export class ApproveTaskRequestDto implements ReviewApproval<"FT"> {
  @ApiProperty({ required: true, enum: reviewers })
  @IsEnum(reviewers, {
    message: () => `Seuls ${reviewers.join(", ")} peuvent approuver une FT`,
  })
  team: Reviewer<"FT">;
}

export class IgnoreTaskRequestDto implements ReviewIgnoreTask {
  @ApiProperty({ required: true, enum: reviewers })
  @IsEnum([LOG_ELEC, LOG_MATOS], {
    message: () => "Seule les équipes elec et matos peuvent ignorer une FT",
  })
  team: Reviewer<"FT">;
}
