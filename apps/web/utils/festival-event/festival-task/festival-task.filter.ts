import {
  elec,
  type FestivalTask,
  humain,
  matos,
  type ReviewStatus,
} from "@overbookd/festival-event";
import {
  IN_REVIEW,
  VALIDATED,
  REFUSED,
  DRAFT,
  READY_TO_ASSIGN,
} from "@overbookd/festival-event-constants";
import type { User } from "@overbookd/user";
import { stringifyQueryParam } from "../../http/url-params.utils";
import type { Team } from "@overbookd/team";
import type { LocationQuery } from "vue-router";
import { findReviewStatus } from "../festival-event.utils";

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

export class TaskFilterBuilder {
  static getFromRouteQuery(query: LocationQuery): TaskFilters {
    const search = this.extractQueryParamsValue(query, "search");
    const team = this.extractQueryParamsValue(query, "team");
    const adherent = this.extractQueryParamsValue(query, "adherent");
    const status = this.extractQueryParamsValue(query, "status");
    const reviewer = this.extractQueryParamsValue(query, "reviewer");
    const humainReview = this.extractQueryParamsValue(query, humain);
    const matosReview = this.extractQueryParamsValue(query, matos);
    const elecReview = this.extractQueryParamsValue(query, elec);

    return {
      ...search,
      ...team,
      ...adherent,
      ...status,
      ...reviewer,
      ...humainReview,
      ...matosReview,
      ...elecReview,
    };
  }

  private static extractQueryParamsValue(
    params: LocationQuery,
    key: keyof TaskFilters,
  ): TaskFilters {
    switch (key) {
      case "search": {
        const searchString = stringifyQueryParam(params.search);
        const search = searchString ? searchString : undefined;
        return search ? { search } : {};
      }
      case "team": {
        const teamCode = stringifyQueryParam(params.team);
        const teamStore = useTeamStore();
        const team = teamStore.getTeamByCode(teamCode);
        return team ? { team } : {};
      }
      case "adherent": {
        const adherentId = stringifyQueryParam(params.adherent);
        const defaultId = isNaN(+adherentId) ? 0 : +adherentId;
        const userStore = useUserStore();
        const adherent = userStore.adherents.find(({ id }) => id === defaultId);
        return adherent ? { adherent } : {};
      }
      case "status": {
        const statusString = stringifyQueryParam(params.status);
        const status = findStatus(statusString);
        return status ? { status } : {};
      }
      case "reviewer": {
        const reviewerId = stringifyQueryParam(params.reviewer);
        const defaultId = isNaN(+reviewerId) ? 0 : +reviewerId;
        const userStore = useUserStore();
        const reviewer = userStore.adherents.find(({ id }) => id === defaultId);
        return reviewer ? { reviewer } : {};
      }
      case "humain": {
        const review = stringifyQueryParam(params.humain);
        const humain = findReviewStatus(review);
        return humain ? { humain } : {};
      }
      case "matos": {
        const review = stringifyQueryParam(params.matos);
        const matos = findReviewStatus(review);
        return matos ? { matos } : {};
      }
      case "elec": {
        const review = stringifyQueryParam(params.elec);
        const elec = findReviewStatus(review);
        return elec ? { elec } : {};
      }
    }
  }
}

export function findStatus(status: string): FestivalTask["status"] | undefined {
  if (!status) return undefined;
  switch (status) {
    case IN_REVIEW:
      return IN_REVIEW;
    case VALIDATED:
      return VALIDATED;
    case REFUSED:
      return REFUSED;
    case READY_TO_ASSIGN:
      return READY_TO_ASSIGN;
    case DRAFT:
    default:
      return DRAFT;
  }
}
