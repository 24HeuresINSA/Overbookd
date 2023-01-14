import { ApiProperty } from '@nestjs/swagger';
import { FtStatus, ftSubjectType, reviewStatus } from '@prisma/client';
import { AllFtResponse, FtResponse } from '../ftTypes';

class UserName {
  firstname: string;
  lastname: string;
}
class Comment {
  id: number;
  comment: string;
  subject: ftSubjectType;
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
  teamCode: string;
  team: {
    name: string;
    color: string;
    icon: string;
  };
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
  teamCode: string;
  team: {
    name: string;
  };
}
export class FtResponseDto implements FtResponse {
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
    description: 'The parent fa id of the ft',
    type: Number,
  })
  parentFaId: number;

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
    required: true,
    description: 'The user id in charge of the ft',
    type: Number,
  })
  userInChargeId: number;

  @ApiProperty({
    required: true,
    description: 'The location id of the ft',
    type: Number,
  })
  locationId: number;

  @ApiProperty({
    required: true,
    description: 'ft delete status',
    type: Boolean,
  })
  isDeleted: boolean;

  @ApiProperty({
    required: true,
    description: 'All the comments of the ft',
    isArray: true,
    type: Comment,
  })
  comments: Comment[];

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
}

export class AllFtResponseDto implements AllFtResponse {
  name: string;
  id: number;
  status: FtStatus;
  parentFaId: number;
  userInCharge: UserName;
  reviews: Review[];
}
