import {
  APPROVED,
  DRAFT,
  FestivalActivity,
  IN_REVIEW,
  NOT_ASKING_TO_REVIEW,
  REVIEWING,
  ReviewStatus,
  VALIDATED,
} from "@overbookd/festival-activity";
import { Team } from "../models/team.model";

export type Filters = {
  search?: string;
  team?: Team;
  status?: FestivalActivity["status"];
  humain?: ReviewStatus;
  communication?: ReviewStatus;
  matos?: ReviewStatus;
  secu?: ReviewStatus;
  signa?: ReviewStatus;
  barrieres?: ReviewStatus;
  elec?: ReviewStatus;
};

type QueryParamsValue = string | (string | null)[];

type IsNotEmpty = (value: string) => string | undefined;
type IsExistingStatus = (
  value: string,
) => FestivalActivity["status"] | undefined;
type IsExistingTeam = (value: string) => Team | undefined;
type IsExistingReview = (value: string) => ReviewStatus | undefined;

type InitFilterBuilder = {
  isNotEmpty: IsNotEmpty;
  isExistingStatus: IsExistingStatus;
  isExistingTeam: IsExistingTeam;
  isExistingReview: IsExistingReview;
};

export class FilterBuilder {
  private constructor(
    private readonly isNotEmpty: IsNotEmpty,
    private readonly isExistingStatus: IsExistingStatus,
    private readonly isExistingTeam: IsExistingTeam,
    private readonly isExistingReview: IsExistingReview,
  ) {}

  static init(initializer: InitFilterBuilder) {
    return new FilterBuilder(
      initializer.isNotEmpty,
      initializer.isExistingStatus,
      initializer.isExistingTeam,
      initializer.isExistingReview,
    );
  }

  extractQueryParamsValue(
    params: Record<string, QueryParamsValue>,
    key: keyof Filters,
  ): Filters {
    switch (key) {
      case "search": {
        const searchString = strigifyQueryParam(params.search);
        const search = this.isNotEmpty(searchString);
        return search ? { search } : {};
      }
      case "team": {
        const teamCode = strigifyQueryParam(params.team);
        const team = this.isExistingTeam(teamCode);
        return team ? { team } : {};
      }
      case "status": {
        const statusString = strigifyQueryParam(params.status);
        const status = this.isExistingStatus(statusString);
        return status ? { status } : {};
      }
      case "humain": {
        const review = strigifyQueryParam(params.humain);
        const humain = this.isExistingReview(review);
        return humain ? { humain } : {};
      }
      case "communication": {
        const review = strigifyQueryParam(params.communication);
        const communication = this.isExistingReview(review);
        return communication ? { communication } : {};
      }
      case "matos": {
        const review = strigifyQueryParam(params.matos);
        const matos = this.isExistingReview(review);
        return matos ? { matos } : {};
      }
      case "secu": {
        const review = strigifyQueryParam(params.secu);
        const secu = this.isExistingReview(review);
        return secu ? { secu } : {};
      }
      case "signa": {
        const review = strigifyQueryParam(params.signa);
        const signa = this.isExistingReview(review);
        return signa ? { signa } : {};
      }
      case "barrieres": {
        const review = strigifyQueryParam(params.barrieres);
        const barrieres = this.isExistingReview(review);
        return barrieres ? { barrieres } : {};
      }
      case "elec": {
        const review = strigifyQueryParam(params.elec);
        const elec = this.isExistingReview(review);
        return elec ? { elec } : {};
      }
    }
  }
}

export function findReviewStatus(status: string): ReviewStatus | undefined {
  if (!status) return undefined;

  switch (status) {
    case APPROVED:
      return APPROVED;
    case REVIEWING:
      return REVIEWING;
    case NOT_ASKING_TO_REVIEW:
    default:
      return NOT_ASKING_TO_REVIEW;
  }
}

export function findStatus(
  status: string,
): FestivalActivity["status"] | undefined {
  if (!status) return undefined;
  switch (status) {
    case IN_REVIEW:
      return IN_REVIEW;
    case VALIDATED:
      return VALIDATED;
    case DRAFT:
    default:
      return DRAFT;
  }
}

function strigifyQueryParam(param?: QueryParamsValue): string {
  if (Array.isArray(param)) return "";
  return param ?? "";
}

export function nonEmptyString(value: string): string | undefined {
  return value ? value : undefined;
}
