import { InReviewWithConflicts } from "@overbookd/http";

export class ReviewableFestivalTaskResponseDto
  implements InReviewWithConflicts
{
  id: InReviewWithConflicts["id"];
  status: InReviewWithConflicts["status"];
  general: InReviewWithConflicts["general"];
  festivalActivity: InReviewWithConflicts["festivalActivity"];
  instructions: InReviewWithConflicts["instructions"];
  history: InReviewWithConflicts["history"];
  feedbacks: InReviewWithConflicts["feedbacks"];
  inquiries: InReviewWithConflicts["inquiries"];
  mobilizations: InReviewWithConflicts["mobilizations"];
  reviews: InReviewWithConflicts["reviews"];
  reviewer: InReviewWithConflicts["reviewer"];
}
