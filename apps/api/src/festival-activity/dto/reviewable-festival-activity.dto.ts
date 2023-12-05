import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import {
  Adherent,
  Contractor,
  ElectricitySupply,
  Feedback,
  IN_REVIEW,
  InReview,
  InReviewReviews,
  InquiryRequest,
  InquiryWithPotentialRequests,
  Location,
  REFUSED,
  Refused,
  RefusedReviews,
  Reviewable,
  Signage,
  TimeWindow,
  VALIDATED,
  Validated,
  ValidatedReviews,
} from "@overbookd/festival-activity";
import { AdherentResponseDto } from "./adherent.response.dto";
import { ContractorResponseDto } from "./contractor.response.dto";
import { TimeWindowResponseDto } from "./time-window.response.dto";
import { LocationResponseDto } from "./location.response.dto";
import { SignageResponseDto } from "./signage.response.dto";
import { ElectricitySupplyResponseDto } from "./electricity-supply.response.dto";
import { FeedbackResponseDto } from "./feedback.response.dto";
import {
  AssignedInquiryRequestResponsDto,
  UnassignedInquiryRequestResponsDto,
} from "./inquiry-request.response.dto";
import {
  InReviewReviewsResponseDto,
  ValidatedReviewsResponseDto,
  RefusedReviewsResponseDto,
} from "./InReviewReviewsResponseDto";

type PublicGeneral = Extract<Reviewable["general"], { toPublish: true }>;
type PrivateGeneral = Extract<Reviewable["general"], { toPublish: false }>;

class PublicReviewableGeneralResponseDto implements PublicGeneral {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  description: string;

  @ApiProperty({ required: true, type: String, isArray: true })
  categories: [string, ...string[]];

  @ApiProperty({ required: true })
  toPublish: true;

  @ApiProperty({ required: true })
  photoLink: string;

  @ApiProperty({ required: true })
  isFlagship: boolean;

  @ApiProperty({ required: true, type: TimeWindowResponseDto, isArray: true })
  timeWindows: [TimeWindow, ...TimeWindow[]];
}

class PrivateGeneralResponseDto implements PrivateGeneral {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  description: string;

  @ApiProperty({ required: true, isArray: true, type: String })
  categories: string[];

  @ApiProperty({ required: true })
  toPublish: false;

  @ApiProperty({ required: true, nullable: true })
  photoLink: null;

  @ApiProperty({ required: true })
  isFlagship: false;

  @ApiProperty({ required: true, type: TimeWindowResponseDto, isArray: true })
  timeWindows: TimeWindow[];
}

type InCharge = Reviewable["inCharge"];

class InChargeRequestDto implements InCharge {
  @ApiProperty({ required: true, type: AdherentResponseDto })
  adherent: Adherent;

  @ApiProperty({ required: true })
  team: string;

  @ApiProperty({ required: true, isArray: true, type: ContractorResponseDto })
  contractors: Contractor[];
}

type Signa = Reviewable["signa"];

class SignaResponseDto implements Signa {
  @ApiProperty({ required: true, type: LocationResponseDto })
  location: Location;

  @ApiProperty({ required: true, isArray: true, type: SignageResponseDto })
  signages: Signage[];
}

type Security = Reviewable["security"];

class SecurityResponseDto implements Security {
  @ApiProperty({
    required: true,
    description: "Mandatory security measure",
    nullable: true,
  })
  specialNeed: string | null;
}

type Supply = Reviewable["supply"];

class SupplyResponseDto implements Supply {
  @ApiProperty({
    required: true,
    nullable: true,
    type: ElectricitySupplyResponseDto,
  })
  electricity: ElectricitySupply[];

  @ApiProperty({ required: true, nullable: true })
  water: string | null;
}

class InquiryResponseDto implements InquiryWithPotentialRequests {
  @ApiProperty({ required: true, isArray: true, type: TimeWindowResponseDto })
  timeWindows: TimeWindow[];

  @ApiProperty({
    required: true,
    isArray: true,
    description: "Barriers related requests",
    oneOf: [
      { $ref: getSchemaPath(UnassignedInquiryRequestResponsDto) },
      { $ref: getSchemaPath(AssignedInquiryRequestResponsDto) },
    ],
  })
  barriers: InquiryRequest[];

  @ApiProperty({
    required: true,
    isArray: true,
    description: "Gears related requests",
    oneOf: [
      { $ref: getSchemaPath(UnassignedInquiryRequestResponsDto) },
      { $ref: getSchemaPath(AssignedInquiryRequestResponsDto) },
    ],
  })
  gears: InquiryRequest[];

  @ApiProperty({
    required: true,
    isArray: true,
    description: "Electricity related requests",
    oneOf: [
      { $ref: getSchemaPath(UnassignedInquiryRequestResponsDto) },
      { $ref: getSchemaPath(AssignedInquiryRequestResponsDto) },
    ],
  })
  electricity: InquiryRequest[];
}

class ReviewableBaseResponseDto {
  @ApiProperty({ required: true })
  id: Reviewable["id"];

  @ApiProperty({
    required: true,
    oneOf: [
      { $ref: getSchemaPath(PublicReviewableGeneralResponseDto) },
      { $ref: getSchemaPath(PrivateGeneralResponseDto) },
    ],
  })
  general: Reviewable["general"];

  @ApiProperty({ required: true, type: InChargeRequestDto })
  inCharge: Reviewable["inCharge"];

  @ApiProperty({ required: true, type: SignaResponseDto })
  signa: Reviewable["signa"];

  @ApiProperty({ required: true, type: SecurityResponseDto })
  security: Reviewable["security"];

  @ApiProperty({ required: true, type: SupplyResponseDto })
  supply: Reviewable["supply"];

  @ApiProperty({ required: true, type: InquiryResponseDto })
  inquiry: Reviewable["inquiry"];

  @ApiProperty({ required: true, isArray: true, type: FeedbackResponseDto })
  feedbacks: Feedback[];
}

export class InReviewFestivalActivityResponseDto
  extends ReviewableBaseResponseDto
  implements InReview
{
  @ApiProperty({ required: true, example: IN_REVIEW })
  status: typeof IN_REVIEW;

  @ApiProperty({ required: true, type: InReviewReviewsResponseDto })
  reviews: InReviewReviews;
}

export class ValidatedFestivalActivityResponseDto
  extends ReviewableBaseResponseDto
  implements Validated
{
  @ApiProperty({ required: true, example: VALIDATED })
  status: typeof VALIDATED;

  @ApiProperty({ required: true, type: ValidatedReviewsResponseDto })
  reviews: ValidatedReviews;
}

export class RefusedFestivalActivityResponseDto
  extends ReviewableBaseResponseDto
  implements Refused
{
  @ApiProperty({ required: true, example: REFUSED })
  status: typeof REFUSED;

  @ApiProperty({ required: true, type: RefusedReviewsResponseDto })
  reviews: RefusedReviews;
}
