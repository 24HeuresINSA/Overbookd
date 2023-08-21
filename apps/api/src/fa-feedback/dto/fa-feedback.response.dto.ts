import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsString } from "class-validator";
import {
  FaFeedbackAuthor,
  FaFeedbackResponse,
  FaFeedbackSubjectType,
} from "../fa-feedback.model";

export class FaFeedbackResponseDto implements FaFeedbackResponse {
  @ApiProperty({
    required: true,
    description: "The id of the ft feedback",
    type: Number,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    required: true,
    type: FaFeedbackAuthor,
    description: "The author of feedback",
  })
  @IsNumber()
  author: FaFeedbackAuthor;

  @ApiProperty({
    required: true,
    type: Date,
    description: "The date of feedback creation",
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    required: true,
    type: String,
    description: "The subject of feedback",
  })
  @IsString()
  subject: FaFeedbackSubjectType;

  @ApiProperty({
    required: true,
    type: String,
    description: "The comment of feedback",
  })
  @IsString()
  comment: string;
}
