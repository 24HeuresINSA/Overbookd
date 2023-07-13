import { ApiProperty } from '@nestjs/swagger';
import {
  BaseFt,
  BaseFtRepresentation,
  CompleteFaResponse,
  FaElectricityNeed,
  FaElectricityNeedRepresentation,
  FaFeedback,
  FaFeedbackRepresentation,
  FaReview,
  FaReviewRepresentation,
  FaSignaNeed,
  FaSignaNeedRepresentation,
  FaStatus,
  FaTimeWindow,
  FaTimeWindowRepresentation,
  FaType,
  SignaLocation,
  SignaLocationRepresentation,
  SitePublishAnimation,
  SitePublishAnimationRepresentation,
  Team,
  TeamRepresentation,
  UserNameWithId,
  UserNameWithIdRepresentation,
  faStatuses,
  faTypes,
} from '../fa.model';
import { CollaboratorRepresentation } from '../../collaborator/collaborator.model';
import { CollaboratorFormRequestDto } from '../../collaborator/dto/collaboratorFormRequest.dto';

export class CompleteFaResponseDto implements CompleteFaResponse {
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
    description: 'The description of the fa',
    type: String,
  })
  description: string;

  @ApiProperty({
    required: false,
    description: 'The type of the fa',
    enum: faTypes,
  })
  type?: FaType;

  @ApiProperty({
    required: false,
    description: 'The team of the fa',
    type: TeamRepresentation,
  })
  team?: Team;

  @ApiProperty({
    required: false,
    description: 'The user in charge of the fa',
    type: UserNameWithIdRepresentation,
  })
  userInCharge?: UserNameWithId;

  @ApiProperty({
    required: false,
    description: 'The location of the fa',
    type: SignaLocationRepresentation,
  })
  location?: SignaLocation;

  @ApiProperty({
    required: false,
    description: 'The security need of the fa',
    type: String,
  })
  securityNeed?: string;

  @ApiProperty({
    required: true,
    description: 'Pass required in the fa',
    type: Boolean,
  })
  isPassRequired: boolean;

  @ApiProperty({
    required: false,
    description: 'The number of pass required in the fa',
    type: Number,
  })
  numberOfPass?: number;

  @ApiProperty({
    required: false,
    description: 'The water need of the fa',
    type: String,
  })
  waterNeed?: string;

  @ApiProperty({
    required: false,
    description: 'The collaborator of the fa',
    type: CollaboratorRepresentation,
  })
  collaborator?: CollaboratorFormRequestDto;

  @ApiProperty({
    required: true,
    description: 'The electricity needs of the fa',
    type: FaElectricityNeedRepresentation,
    isArray: true,
  })
  electricityNeeds: FaElectricityNeed[];

  @ApiProperty({
    required: true,
    description: 'The signa needs of the fa',
    type: FaSignaNeedRepresentation,
    isArray: true,
  })
  signaNeeds: FaSignaNeed[];

  @ApiProperty({
    required: true,
    description: 'The validations of the fa',
    type: FaReviewRepresentation,
    isArray: true,
  })
  faValidation: FaReview[];

  @ApiProperty({
    required: true,
    description: 'The refusals of the fa',
    type: FaReviewRepresentation,
    isArray: true,
  })
  faRefuse: FaReview[];

  @ApiProperty({
    required: true,
    description: 'The feedabcks of the fa',
    type: FaFeedbackRepresentation,
    isArray: true,
  })
  feedbacks: FaFeedback[];

  @ApiProperty({
    required: true,
    description: 'The time windows of the fa',
    type: FaTimeWindowRepresentation,
    isArray: true,
  })
  timeWindows: FaTimeWindow[];

  @ApiProperty({
    required: true,
    description: 'The site publish animation of the fa',
    type: SitePublishAnimationRepresentation,
  })
  faSitePublishAnimation: SitePublishAnimation;

  @ApiProperty({
    required: true,
    description: 'The fts of the fa',
    type: BaseFtRepresentation,
    isArray: true,
  })
  fts: BaseFt[];
}
