import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import {
  FestivalTaskInReview as InReview,
  FestivalTaskRefused as Refused,
  FestivalTaskReviewable as Reviewable,
  FestivalTaskValidated as Validated,
  FestivalTaskReadyToAssign as ReadyToAssign,
} from "@overbookd/festival-event";
import { categories } from "@overbookd/festival-event-constants";
import { ReviewableWithConflicts } from "@overbookd/http";
import {
  IN_REVIEW,
  READY_TO_ASSIGN,
  REFUSED,
  VALIDATED,
} from "@overbookd/festival-event-constants";
import { ReviewableGeneralResponseDto } from "./reviewable-general.response.dto";
import { FestivalActivityResponseDto } from "../festival-activity.response.dto";
import { ReviewableInstructionsResponseDto } from "./reviewable-instructions.response.dto";
import { KeyEventResponseDto } from "../key-event.response.dto";
import {
  TaskInReviewReviewsResponseDto,
  TaskRefusedReviewsResponseDto,
  TaskValidatedReviewsResponseDto,
} from "./reviews.response.dto";
import {
  MobilizationWithAtLeastOneTeamAndAssignmentsDto,
  MobilizationWithAtLeastOneTeamDto,
  MobilizationWithAtLeastOneVolunteerAndAssignmentsDto,
  MobilizationWithAtLeastOneVolunteerDto,
} from "./reviewable-mobilization.response.dto";
import { FeedbackResponseDto } from "../../../../common/dto/feedback.response.dto";
import { AdherentResponseDto } from "../../../../common/dto/adherent.response.dto";
import {
  AssignedInquiryRequestResponseDto,
  UnassignedInquiryRequestResponseDto,
} from "../../../../common/dto/inquiry-request.response.dto";

type InReviewWithConflicts = Extract<ReviewableWithConflicts, InReview>;
type RefusedWithConflicts = Extract<ReviewableWithConflicts, Refused>;
type ValidatedWithConflicts = Extract<ReviewableWithConflicts, Validated>;
type ReadyToAssignWithConflicts = Extract<
  ReviewableWithConflicts,
  ReadyToAssign
>;
type BaseReviewableWithConflicts = Omit<
  ReviewableWithConflicts,
  "status" | "reviews" | "mobilizations"
>;

class BaseReviewableWithConflictsResponseDto
  implements BaseReviewableWithConflicts
{
  @ApiProperty()
  id: Reviewable["id"];

  @ApiProperty({
    description: "The festival task general",
    type: ReviewableGeneralResponseDto,
  })
  general: Reviewable["general"];

  @ApiProperty({
    description: "The festival activity linked",
    type: FestivalActivityResponseDto,
  })
  festivalActivity: Reviewable["festivalActivity"];

  @ApiProperty({
    description: "The festival task instructions",
    type: ReviewableInstructionsResponseDto,
  })
  instructions: Reviewable["instructions"];

  @ApiProperty({
    description: "Festival task key events",
    isArray: true,
    type: KeyEventResponseDto,
  })
  history: Reviewable["history"];

  @ApiProperty({
    description: "The feedbacks",
    isArray: true,
    type: FeedbackResponseDto,
  })
  feedbacks: Reviewable["feedbacks"];

  @ApiProperty({
    description: "The inquiry requests",
    oneOf: [
      { $ref: getSchemaPath(UnassignedInquiryRequestResponseDto) },
      { $ref: getSchemaPath(AssignedInquiryRequestResponseDto) },
    ],
    isArray: true,
  })
  inquiries: Reviewable["inquiries"];

  @ApiProperty({
    description: "The festival task reviewer",
    type: AdherentResponseDto,
  })
  reviewer: Reviewable["reviewer"];
}

export class InReviewFestivalTaskResponseDto
  extends BaseReviewableWithConflictsResponseDto
  implements InReviewWithConflicts
{
  @ApiProperty({ enum: [IN_REVIEW] })
  status: InReview["status"];

  @ApiProperty({
    description: "The festival task reviews",
    type: TaskInReviewReviewsResponseDto,
  })
  reviews: InReview["reviews"];

  @ApiProperty({
    description: "The festival task mobilizations",
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(MobilizationWithAtLeastOneVolunteerDto) },
      { $ref: getSchemaPath(MobilizationWithAtLeastOneTeamDto) },
    ],
  })
  mobilizations: ReviewableWithConflicts["mobilizations"];
}

export class RefusedFestivalTaskResponseDto
  extends BaseReviewableWithConflictsResponseDto
  implements RefusedWithConflicts
{
  @ApiProperty({ enum: [REFUSED] })
  status: Refused["status"];

  @ApiProperty({
    description: "The festival task reviews",
    type: TaskRefusedReviewsResponseDto,
  })
  reviews: Refused["reviews"];

  @ApiProperty({
    description: "The festival task mobilizations",
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(MobilizationWithAtLeastOneVolunteerDto) },
      { $ref: getSchemaPath(MobilizationWithAtLeastOneTeamDto) },
    ],
  })
  mobilizations: ReviewableWithConflicts["mobilizations"];
}

export class ValidatedFestivalTaskResponseDto
  extends BaseReviewableWithConflictsResponseDto
  implements ValidatedWithConflicts
{
  @ApiProperty({ enum: [VALIDATED] })
  status: Validated["status"];

  @ApiProperty({
    description: "The festival task reviews",
    type: TaskValidatedReviewsResponseDto,
  })
  reviews: Validated["reviews"];

  @ApiProperty({
    description: "The festival task mobilizations",
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(MobilizationWithAtLeastOneVolunteerDto) },
      { $ref: getSchemaPath(MobilizationWithAtLeastOneTeamDto) },
    ],
  })
  mobilizations: ReviewableWithConflicts["mobilizations"];
}

export class ReadyToAssignFestivalTaskResponseDto
  extends BaseReviewableWithConflictsResponseDto
  implements ReadyToAssignWithConflicts
{
  @ApiProperty({ enum: [READY_TO_ASSIGN] })
  status: ReadyToAssign["status"];

  @ApiProperty({
    description: "The festival task reviews",
    type: TaskValidatedReviewsResponseDto,
  })
  reviews: ReadyToAssign["reviews"];

  @ApiProperty({ enum: categories })
  category?: ReadyToAssign["category"];

  @ApiProperty({ description: "Indicate task is top priority to assign" })
  topPriority: ReadyToAssign["topPriority"];

  @ApiProperty({
    description: "The festival task mobilizations",
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(MobilizationWithAtLeastOneTeamAndAssignmentsDto) },
      {
        $ref: getSchemaPath(
          MobilizationWithAtLeastOneVolunteerAndAssignmentsDto,
        ),
      },
    ],
  })
  mobilizations: ReadyToAssignWithConflicts["mobilizations"];
}
