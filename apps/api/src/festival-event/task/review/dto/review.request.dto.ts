import { ApiProperty } from "@nestjs/swagger";
import { Reviewer, elec, humain, matos } from "@overbookd/festival-event";
import {
  ReviewApproval,
  ReviewIgnoreTask,
  ReviewRejection,
} from "@overbookd/http";
import { IsEnum, IsString } from "class-validator";

const reviewers: Reviewer<"FT">[] = [humain, matos, elec];

export class RejectRequestDto implements ReviewRejection<"FT"> {
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

export class ApproveRequestDto implements ReviewApproval<"FT"> {
  @ApiProperty({ required: true, enum: reviewers })
  @IsEnum(reviewers, {
    message: () => `Seuls ${reviewers.join(", ")} peuvent approuver une FT`,
  })
  team: Reviewer<"FT">;
}

export class IgnoreTaskRequestDto implements ReviewIgnoreTask {
  @ApiProperty({ required: true, enum: reviewers })
  @IsEnum([elec, matos], {
    message: () => "Seule les équipes elec et matos peuvent ignorer une FT",
  })
  team: Reviewer<"FT">;
}
