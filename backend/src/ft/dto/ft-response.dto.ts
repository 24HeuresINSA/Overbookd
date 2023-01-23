import { ApiProperty } from '@nestjs/swagger';
import { FtStatus, FtSubjectType, reviewStatus, Status } from '@prisma/client';
import { CompleteFtResponse, LiteFtResponse } from '../ftTypes';

class UserName {
  firstname: string;
  lastname: string;
}

class UserNameWithId extends UserName {
  id: number;
}
class Feedback {
  id: number;
  comment: string;
  subject: FtSubjectType;
  authorId: number;
  createdAt: Date;
  author: UserName;
}

class UserRequest {
  userId: number;
  user: {
    firstname: string;
    lastname: string;
  };
}

class TeamRequest {
  number: number;
  team: Team;
}

class TimeWindow {
  id: number;
  start: Date;
  end: Date;
  userRequests: UserRequest[];
  teamRequests: TeamRequest[];
  sliceTime: number;
}

class Review {
  status: reviewStatus;
  team: Team;
}

class Team {
  id: number;
  name: string;
  color: string;
  icon: string;
  code: string;
}

class MinimalFa {
  id: number;
  name: string;
  status: Status;
}

class SignaLocation {
  id: number;
  name: string;
}

export class CompleteFtResponseDto implements CompleteFtResponse {
  @ApiProperty({
    required: true,
    description: 'The id of the ft',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The name of the ft',
    type: String,
  })
  name: string;

  @ApiProperty({
    required: true,
    description: 'The status of the ft',
    enum: FtStatus,
  })
  status: FtStatus;

  @ApiProperty({
    required: true,
    description: 'ft static status',
    type: Boolean,
  })
  isStatic: boolean;

  @ApiProperty({
    required: true,
    description: 'The description of the ft',
    type: String,
  })
  description: string;

  @ApiProperty({
    required: false,
    description: 'The location of the ft',
    type: SignaLocation,
  })
  location: SignaLocation | null;

  @ApiProperty({
    required: true,
    description: 'ft delete status',
    type: Boolean,
  })
  isDeleted: boolean;

  @ApiProperty({
    required: true,
    description: 'All feedbacks of the ft',
    isArray: true,
    type: Feedback,
  })
  feedbacks: Feedback[];

  @ApiProperty({
    required: true,
    description: 'All the time windows of the ft with their requests',
    isArray: true,
    type: TimeWindow,
  })
  timeWindows: TimeWindow[];

  @ApiProperty({
    required: true,
    description: 'All the reviews of the ft',
    isArray: true,
    type: Review,
  })
  reviews: Review[];

  @ApiProperty({
    required: false,
    description: 'The team in charge of the ft',
    type: Team,
  })
  team: Team | null;

  @ApiProperty({
    required: false,
    description: 'The user in charge of the ft',
    type: UserNameWithId,
  })
  userInCharge: UserNameWithId | null;

  @ApiProperty({
    required: true,
    description: 'The parent fa of the ft',
    type: MinimalFa,
  })
  fa: MinimalFa | null;
}

export class LiteFtResponseDto implements LiteFtResponse {
  @ApiProperty({
    required: true,
    description: 'The name of the ft',
    type: String,
  })
  name: string;

  @ApiProperty({
    required: true,
    description: 'The id of the ft',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The status of the ft',
    enum: FtStatus,
  })
  status: FtStatus;

  @ApiProperty({
    required: false,
    description: 'The user in charge of the ft',
    type: UserName,
  })
  userInCharge: UserName | null;

  @ApiProperty({
    required: false,
    description: 'The team in charge of the ft',
    type: Team,
  })
  team: Team | null;

  @ApiProperty({
    required: true,
    description: 'The reviews of the ft',
    isArray: true,
    type: Review,
  })
  reviews: Review[];
}
