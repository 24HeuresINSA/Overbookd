import { ApiProperty } from '@nestjs/swagger';
import {
  FaReview,
  FaReviewTeam,
  FaStatus,
  LiteFaResponse,
  Team,
  UserNameWithId,
  faStatuses,
} from '../fa.model';

export class LiteFaResponseDto implements LiteFaResponse {
  @ApiProperty({
    required: true,
    description: 'The id of the ft',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The name of the fa',
    type: String,
  })
  name: string;

  @ApiProperty({
    required: true,
    description: 'The status of the fa',
    enum: faStatuses,
  })
  status: FaStatus;

  @ApiProperty({
    required: true,
    description: 'The delete status of the fa',
    type: Boolean,
  })
  isDeleted: boolean;

  @ApiProperty({
    required: false,
    description: 'The team of the fa',
    type: Team,
  })
  team?: Team;

  @ApiProperty({
    required: false,
    description: 'The user in charge of the fa',
    type: UserNameWithId,
  })
  userInCharge?: UserNameWithId;

  @ApiProperty({
    required: true,
    description: 'The validations of the fa',
    type: FaReview,
    isArray: true,
  })
  faValidation: FaReviewTeam[];

  @ApiProperty({
    required: true,
    description: 'The refusals of the fa',
    type: FaReview,
    isArray: true,
  })
  faRefuse: FaReviewTeam[];
}
