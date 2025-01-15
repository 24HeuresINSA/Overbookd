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
import { stringifyQueryParam } from "~/utils/http/url-params.utils";
import type { Team } from "@overbookd/team";
import type { LocationQuery } from "vue-router";
import { findTaskReviewerStatusByString } from "./festival-task.utils";
import {
  ADHERENT_QUERY_PARAM,
  ITEMS_PER_PAGE_QUERY_PARAM,
  REVIEWER_QUERY_PARAM,
  SEARCH_QUERY_PARAM,
  STATUS_QUERY_PARAM,
  TEAM_QUERY_PARAM,
} from "../festival-event.constant";

export type TaskReviewsFilter = {
  humain?: ReviewStatus<"FT">;
  matos?: ReviewStatus<"FT">;
  elec?: ReviewStatus<"FT">;
};

export type TaskFilters = TaskReviewsFilter & {
  search?: string;
  team?: Team;
  adherent?: User;
  status?: FestivalTask["status"];
  reviewer?: User;
  itemsPerPage?: number;
};

export class TaskFilterBuilder {
  static getFromRouteQuery(query: LocationQuery): TaskFilters {
    const search = this.extractQueryParamsValue(query, SEARCH_QUERY_PARAM);
    const team = this.extractQueryParamsValue(query, TEAM_QUERY_PARAM);
    const adherent = this.extractQueryParamsValue(query, ADHERENT_QUERY_PARAM);
    const status = this.extractQueryParamsValue(query, STATUS_QUERY_PARAM);
    const reviewer = this.extractQueryParamsValue(query, REVIEWER_QUERY_PARAM);
    const itemsPerPage = this.extractQueryParamsValue(
      query,
      ITEMS_PER_PAGE_QUERY_PARAM,
    );
    const humainReview = this.extractQueryParamsValue(query, humain);
    const matosReview = this.extractQueryParamsValue(query, matos);
    const elecReview = this.extractQueryParamsValue(query, elec);

    return {
      ...search,
      ...team,
      ...adherent,
      ...status,
      ...reviewer,
      ...itemsPerPage,
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
      case SEARCH_QUERY_PARAM: {
        const searchString = stringifyQueryParam(params.search);
        const search = searchString ? searchString : undefined;
        return search ? { search } : {};
      }
      case TEAM_QUERY_PARAM: {
        const teamCode = stringifyQueryParam(params.team);
        const teamStore = useTeamStore();
        const team = teamStore.getTeamByCode(teamCode);
        return team ? { team } : {};
      }
      case ADHERENT_QUERY_PARAM: {
        const adherentId = stringifyQueryParam(params.adherent);
        const defaultId = isNaN(+adherentId) ? 0 : +adherentId;
        const userStore = useUserStore();
        const adherent = userStore.adherents.find(({ id }) => id === defaultId);
        return adherent ? { adherent } : {};
      }
      case STATUS_QUERY_PARAM: {
        const statusString = stringifyQueryParam(params.status);
        const status = findStatus(statusString);
        return status ? { status } : {};
      }
      case REVIEWER_QUERY_PARAM: {
        const reviewerId = stringifyQueryParam(params.reviewer);
        const defaultId = isNaN(+reviewerId) ? 0 : +reviewerId;
        const userStore = useUserStore();
        const reviewer = userStore.adherents.find(({ id }) => id === defaultId);
        return reviewer ? { reviewer } : {};
      }
      case ITEMS_PER_PAGE_QUERY_PARAM: {
        const itemsPerPage = stringifyQueryParam(params.itemsPerPage);
        return itemsPerPage ? { itemsPerPage: +itemsPerPage } : {};
      }
      case humain: {
        const review = stringifyQueryParam(params.humain);
        const humain = findTaskReviewerStatusByString(review);
        return humain ? { humain } : {};
      }
      case matos: {
        const review = stringifyQueryParam(params.matos);
        const matos = findTaskReviewerStatusByString(review);
        return matos ? { matos } : {};
      }
      case elec: {
        const review = stringifyQueryParam(params.elec);
        const elec = findTaskReviewerStatusByString(review);
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
