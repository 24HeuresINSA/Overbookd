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
} from "@overbookd/festival-event";
import { ReviewRejection } from "@overbookd/http";
import { IsEnum, IsString } from "class-validator";

const reviewers: Reviewer<"FA">[] = [
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
  team: Reviewer<"FA">;
}

export class RejectRequestDto implements ReviewRejection<"FA"> {
  @ApiProperty({ required: true, enum: reviewers })
  @IsEnum(reviewers, {
    message: () => `❌ Seuls ${reviewers.join(", ")} peuvent rejeter une FA`,
  })
  team: Reviewer<"FA">;

  @ApiProperty({
    required: true,
    description: "Explain why festival activity has been rejected",
  })
  @IsString()
  reason: string;
}
