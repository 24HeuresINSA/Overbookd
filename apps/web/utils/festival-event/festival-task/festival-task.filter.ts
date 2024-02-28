import {
  APPROVED,
  DRAFT,
  FestivalTask,
  IN_REVIEW,
  NOT_ASKING_TO_REVIEW,
  REFUSED,
  REJECTED,
  REVIEWING,
  ReviewStatus,
  VALIDATED,
} from "@overbookd/festival-event";
import { User } from "@overbookd/user";
import { Team } from "../../models/team.model";
import { QueryParamsValue, strigifyQueryParam } from "../festival-event.filter";

export type TaskReviewsFilter = {
  humain?: ReviewStatus;
  matos?: ReviewStatus;
  elec?: ReviewStatus;
};

export type TaskFilters = TaskReviewsFilter & {
  search?: string;
  team?: Team;
  adherent?: User;
  status?: FestivalTask["status"];
  reviewer?: User;
};

type IsNotEmpty = (value: string) => string | undefined;
type IsExistingStatus = (value: string) => FestivalTask["status"] | undefined;
type IsExistingTeam = (value: string) => Team | undefined;
type IsExistingAdherent = (id: User["id"]) => User | undefined;
type IsExistingReview = (value: string) => ReviewStatus | undefined;

type InitFilterBuilder = {
  isNotEmpty: IsNotEmpty;
  isExistingStatus: IsExistingStatus;
  isExistingTeam: IsExistingTeam;
  isExistingAdherent: IsExistingAdherent;
  isExistingReview: IsExistingReview;
};

export class TaskFilterBuilder {
  private constructor(
    private readonly isNotEmpty: IsNotEmpty,
    private readonly isExistingStatus: IsExistingStatus,
    private readonly isExistingTeam: IsExistingTeam,
    private readonly isExistingAdherent: IsExistingAdherent,
    private readonly isExistingReview: IsExistingReview,
  ) {}

  static init(initializer: InitFilterBuilder) {
    return new TaskFilterBuilder(
      initializer.isNotEmpty,
      initializer.isExistingStatus,
      initializer.isExistingTeam,
      initializer.isExistingAdherent,
      initializer.isExistingReview,
    );
  }

  extractQueryParamsValue(
    params: Record<string, QueryParamsValue>,
    key: keyof TaskFilters,
  ): TaskFilters {
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
      case "adherent": {
        const adherentId = strigifyQueryParam(params.adherent);
        const defaultId = isNaN(+adherentId) ? 0 : +adherentId;
        const adherent = this.isExistingAdherent(defaultId);
        return adherent ? { adherent } : {};
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
      case "matos": {
        const review = strigifyQueryParam(params.matos);
        const matos = this.isExistingReview(review);
        return matos ? { matos } : {};
      }
      case "elec": {
        const review = strigifyQueryParam(params.elec);
        const elec = this.isExistingReview(review);
        return elec ? { elec } : {};
      }
      case "reviewer": {
        const reviewerId = strigifyQueryParam(params.reviewer);
        const defaultId = isNaN(+reviewerId) ? 0 : +reviewerId;
        const reviewer = this.isExistingAdherent(defaultId);
        return reviewer ? { reviewer } : {};
      }
    }
  }
}

export function findReviewStatus(status: string): ReviewStatus | undefined {
  if (!status) return undefined;

  switch (status) {
    case REJECTED:
      return REJECTED;
    case APPROVED:
      return APPROVED;
    case REVIEWING:
      return REVIEWING;
    case NOT_ASKING_TO_REVIEW:
      return NOT_ASKING_TO_REVIEW;
  }
}

export function findStatus(status: string): FestivalTask["status"] | undefined {
  if (!status) return undefined;

  switch (status) {
    case IN_REVIEW:
      return IN_REVIEW;
    case REFUSED:
      return REFUSED;
    case VALIDATED:
      return VALIDATED;
    case DRAFT:
    default:
      return DRAFT;
  }
}
