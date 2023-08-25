import { ApiProperty } from "@nestjs/swagger";
import { TimeSpanBase } from "../../assignment/model/ft-time-span.model";
import {
  FtUserRequestResponseDto,
  UserRequest,
} from "../../ft-user-request/dto/ft-user-request.response.dto";
import { FtStatus, ftStatuses } from "../ft.model";
import {
  CompleteFtResponse,
  Feedback,
  LiteFtResponse,
  MinimalFa,
  Review,
  SignaLocation,
  TeamRequest,
  TimeWindow,
  UserName,
  UserNameWithId,
} from "../ft-types";
import { SignaLocationRepresentation, faStatuses } from "../../fa/fa.model";
import { FaStatus } from "@prisma/client";
import {
  FtFeedbackSubjectType,
  ftFeedbackSubjectTypes,
} from "../../ft-feedback/ft-feedback.model";
import { ReviewStatus, reviewStatuses } from "../../ft-review/ft-review.model";
import { Team } from "../../team/team.model";

class Author implements UserName {
  firstname: string;
  lastname: string;
  nickname?: string;
}

class FeedbackRepresentation implements Feedback {
  id: number;
  comment: string;
  @ApiProperty({ enum: ftFeedbackSubjectTypes })
  subject: FtFeedbackSubjectType;
  authorId: number;
  createdAt: Date;
  @ApiProperty({ type: Author })
  author: UserName;
}

class RequestedUser implements UserNameWithId {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
}

class TeamRepresentation implements Team {
  name: string;
  color: string;
  icon: string;
  code: string;
}

class TeamRequestRepresentation implements TeamRequest {
  quantity: number;
  @ApiProperty({ type: TeamRepresentation })
  team: Team;
}

class TimeSpanRepresentation implements TimeSpanBase {
  id: number;
  start: Date;
  end: Date;
}

class TimeWindowRepresentation implements TimeWindow {
  id: number;
  start: Date;
  end: Date;
  sliceTime?: number;
  @ApiProperty({ isArray: true, type: FtUserRequestResponseDto })
  userRequests: UserRequest[];
  @ApiProperty({ isArray: true, type: TeamRequestRepresentation })
  teamRequests: TeamRequest[];
  @ApiProperty({ isArray: true, type: TimeSpanRepresentation })
  timeSpans: TimeSpanBase[];
}

class ReviewRepresentation implements Review {
  @ApiProperty({ enum: reviewStatuses })
  status: ReviewStatus;
  @ApiProperty({ type: TeamRepresentation })
  team: Team;
}

class MinimalFaRepresentation implements MinimalFa {
  id: number;
  name: string;
  @ApiProperty({ enum: faStatuses })
  status: FaStatus;
}

export class CompleteFtResponseDto implements CompleteFtResponse {
  @ApiProperty({
    required: true,
    description: "The id of the ft",
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: "The name of the ft",
    type: String,
  })
  name: string;

  @ApiProperty({
    required: true,
    description: "The status of the ft",
    enum: ftStatuses,
  })
  status: FtStatus;

  @ApiProperty({
    required: true,
    description: "ft static status",
    type: Boolean,
  })
  isStatic: boolean;

  @ApiProperty({
    required: true,
    description: "The description of the ft",
    type: String,
  })
  description: string;

  @ApiProperty({
    required: false,
    description: "The location of the ft",
    type: SignaLocationRepresentation,
  })
  location: SignaLocation | null;

  @ApiProperty({
    required: true,
    description: "ft delete status",
    type: Boolean,
  })
  isDeleted: boolean;

  @ApiProperty({
    required: true,
    description: "All feedbacks of the ft",
    isArray: true,
    type: FeedbackRepresentation,
  })
  feedbacks: Feedback[];

  @ApiProperty({
    required: true,
    description: "All the time windows of the ft with their requests",
    isArray: true,
    type: TimeWindowRepresentation,
  })
  timeWindows: TimeWindowRepresentation[];

  @ApiProperty({
    required: true,
    description: "All the reviews of the ft",
    isArray: true,
    type: ReviewRepresentation,
  })
  reviews: Review[];

  @ApiProperty({
    required: false,
    description: "The team in charge of the ft",
    type: TeamRepresentation,
  })
  team: Team | null;

  @ApiProperty({
    required: false,
    description: "The user in charge of the ft",
    type: RequestedUser,
  })
  userInCharge: UserNameWithId | null;

  @ApiProperty({
    required: true,
    description: "The parent fa of the ft",
    type: MinimalFaRepresentation,
  })
  fa: MinimalFa | null;

  @ApiProperty({
    required: false,
    description: "The user in charge of the ft review",
    type: RequestedUser,
  })
  reviewer?: UserNameWithId;
}

export class LiteFtResponseDto implements LiteFtResponse {
  @ApiProperty({
    required: true,
    description: "The name of the ft",
    type: String,
  })
  name: string;

  @ApiProperty({
    required: true,
    description: "The id of the ft",
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: "The status of the ft",
    enum: ftStatuses,
  })
  status: FtStatus;

  @ApiProperty({
    required: false,
    description: "The user in charge of the ft",
    type: RequestedUser,
  })
  userInCharge: UserNameWithId | null;

  @ApiProperty({
    required: false,
    description: "The team in charge of the ft",
    type: TeamRepresentation,
  })
  team: Team | null;

  @ApiProperty({
    required: true,
    description: "The parent fa of the ft",
    type: MinimalFaRepresentation,
  })
  fa: MinimalFa | null;

  @ApiProperty({
    required: true,
    description: "The reviews of the ft",
    isArray: true,
    type: ReviewRepresentation,
  })
  reviews: Review[];

  @ApiProperty({
    required: false,
    description: "The user in charge of the ft review",
    type: RequestedUser,
  })
  reviewer?: UserNameWithId;
}
