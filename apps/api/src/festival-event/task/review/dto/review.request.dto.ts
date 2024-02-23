import { ApiProperty } from "@nestjs/swagger";
import { Reviewer, elec, humain, matos } from "@overbookd/festival-event";
import { ReviewRejection } from "@overbookd/http";
import { IsEnum, IsString } from "class-validator";

const reviewers: Reviewer<"FT">[] = [humain, matos, elec];

export class RejectRequestDto implements ReviewRejection<"FT"> {
  @ApiProperty({ required: true, enum: reviewers })
  @IsEnum(reviewers, {
    message: () => `❌ Seuls ${reviewers.join(", ")} peuvent rejeter une FT`,
  })
  team: Reviewer<"FT">;

  @ApiProperty({
    required: true,
    description: "Explain why festival task has been rejected",
  })
  @IsString()
  reason: string;
}
