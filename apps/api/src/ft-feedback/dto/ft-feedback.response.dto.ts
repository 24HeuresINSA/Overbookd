import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsString } from "class-validator";
import {
  FtFeedbackAuthor,
  FtFeedbackResponse,
  FtFeedbackSubjectType,
  ftFeedbackSubjectTypes,
} from "../ft-feedback.model";

class FtFeedbackAuthorRepresentation implements FtFeedbackAuthor {
  firstname: string;
  lastname: string;
}

export class FtFeedbackResponseDto implements FtFeedbackResponse {
  @ApiProperty({
    required: true,
    description: "The id of the ft feedback",
    type: Number,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    required: true,
    type: FtFeedbackAuthorRepresentation,
    description: "The author of feedback",
  })
  @IsNumber()
  author: FtFeedbackAuthor;

  @ApiProperty({
    required: true,
    type: Date,
    description: "The date of feedback creation",
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    required: true,
    description: "The subject of feedback",
    enum: ftFeedbackSubjectTypes,
  })
  @IsString()
  subject: FtFeedbackSubjectType;

  @ApiProperty({
    required: true,
    type: String,
    description: "The comment of feedback",
  })
  @IsString()
  comment: string;
}
