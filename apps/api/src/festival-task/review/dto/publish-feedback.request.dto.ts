import { ApiProperty } from "@nestjs/swagger";
import { PublishFeedbackForm } from "@overbookd/http";
import { IsString } from "class-validator";

export class PublishFeedbackRequestDto implements PublishFeedbackForm {
  @ApiProperty({ required: true })
  @IsString()
  content: string;
}
