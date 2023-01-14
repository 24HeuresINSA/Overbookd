import { ApiProperty } from '@nestjs/swagger';
import { FtStatus, ftSubjectType, reviewStatus } from '@prisma/client';
import { AllFtResponse, FtResponse } from '../ftTypes';

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
  comments: {
    id: number;
    comment: string;
    subject: ftSubjectType;
    authorId: number;
    createdAt: Date;
    author: { firstname: string; lastname: string };
  }[];
  timeWindows: {
    id: number;
    start: Date;
    end: Date;
    userRequests: {
      userId: number;
      user: { firstname: string; lastname: string };
    }[];
    teamRequests: {
      number: number;
      teamCode: string;
      team: { name: string; color: string; icon: string };
    }[];
  }[];
  reviews: { status: reviewStatus; teamCode: string; team: { name: string } }[];
}

export class AllFtResponseDto implements AllFtResponse {
  name: string;
  id: number;
  status: FtStatus;
  parentFaId: number;
  userInCharge: {
    firstname: string;
    lastname: string;
  };
  reviews: {
    status: reviewStatus;
    teamCode: string;
    team: {
      name: string;
    };
  }[];
}
