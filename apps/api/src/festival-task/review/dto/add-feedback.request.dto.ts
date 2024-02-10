import { ApiProperty } from "@nestjs/swagger";
import { PrepareFeedbackPublish } from "@overbookd/http";
import { IsString } from "class-validator";

export class AddFeedbackRequestDto implements PrepareFeedbackPublish {
  @ApiProperty({ required: true })
  @IsString()
  content: string;
}
