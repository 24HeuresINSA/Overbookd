import {
  barrieres,
  communication,
  elec,
  type FestivalActivity,
  humain,
  matos,
  type ReviewStatus,
  secu,
  signa,
} from "@overbookd/festival-event";
import {
  IN_REVIEW,
  VALIDATED,
  REFUSED,
  DRAFT,
} from "@overbookd/festival-event-constants";
import type { User } from "@overbookd/user";
import { stringifyQueryParam } from "~/utils/http/url-params.utils";
import type { Team } from "@overbookd/team";
import type { LocationQuery } from "vue-router";
import { findActivityReviewerStatusByString } from "./festival-activity.utils";
import {
  ADHERENT_QUERY_PARAM,
  ITEMS_PER_PAGE_QUERY_PARAM,
  NEED_SUPPLY_QUERY_PARAM,
  SEARCH_QUERY_PARAM,
  STATUS_QUERY_PARAM,
  TEAM_QUERY_PARAM,
} from "../festival-event.constant";

export type ActivityReviewsFilter = {
  humain?: ReviewStatus<"FA">;
  communication?: ReviewStatus<"FA">;
  matos?: ReviewStatus<"FA">;
  secu?: ReviewStatus<"FA">;
  signa?: ReviewStatus<"FA">;
  barrieres?: ReviewStatus<"FA">;
  elec?: ReviewStatus<"FA">;
};

export type ActivityFilters = ActivityReviewsFilter & {
  search?: string;
  team?: Team;
  adherent?: User;
  status?: FestivalActivity["status"];
  needSupply?: boolean;
  itemsPerPage?: number;
};

export class ActivityFilterBuilder {
  static getFromRouteQuery(query: LocationQuery): ActivityFilters {
    const search = this.extractQueryParamsValue(query, SEARCH_QUERY_PARAM);
    const team = this.extractQueryParamsValue(query, TEAM_QUERY_PARAM);
    const adherent = this.extractQueryParamsValue(query, ADHERENT_QUERY_PARAM);
    const status = this.extractQueryParamsValue(query, STATUS_QUERY_PARAM);
    const needSupply = this.extractQueryParamsValue(
      query,
      NEED_SUPPLY_QUERY_PARAM,
    );
    const itemsPerPage = this.extractQueryParamsValue(
      query,
      ITEMS_PER_PAGE_QUERY_PARAM,
    );
    const humainReview = this.extractQueryParamsValue(query, humain);
    const matosReview = this.extractQueryParamsValue(query, matos);
    const elecReview = this.extractQueryParamsValue(query, elec);
    const barrieresReview = this.extractQueryParamsValue(query, barrieres);
    const signaReview = this.extractQueryParamsValue(query, signa);
    const secuReview = this.extractQueryParamsValue(query, secu);
    const communicationReview = this.extractQueryParamsValue(
      query,
      communication,
    );

    return {
      ...search,
      ...team,
      ...adherent,
      ...status,
      ...needSupply,
      ...itemsPerPage,
      ...humainReview,
      ...matosReview,
      ...elecReview,
      ...barrieresReview,
      ...signaReview,
      ...secuReview,
      ...communicationReview,
    };
  }

  private static extractQueryParamsValue(
    params: LocationQuery,
    key: keyof ActivityFilters,
  ): ActivityFilters {
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
      case NEED_SUPPLY_QUERY_PARAM: {
        const needSupply = params.needSupply !== undefined;
        return { needSupply };
      }
      case ITEMS_PER_PAGE_QUERY_PARAM: {
        const itemsPerPage = stringifyQueryParam(params.itemsPerPage);
        const isValid = itemsPerPage && !isNaN(+itemsPerPage);
        return isValid ? { itemsPerPage: +itemsPerPage } : {};
      }
      case humain: {
        const review = stringifyQueryParam(params.humain);
        const humain = findActivityReviewerStatusByString(review);
        return humain ? { humain } : {};
      }
      case communication: {
        const review = stringifyQueryParam(params.communication);
        const communication = findActivityReviewerStatusByString(review);
        return communication ? { communication } : {};
      }
      case matos: {
        const review = stringifyQueryParam(params.matos);
        const matos = findActivityReviewerStatusByString(review);
        return matos ? { matos } : {};
      }
      case secu: {
        const review = stringifyQueryParam(params.secu);
        const secu = findActivityReviewerStatusByString(review);
        return secu ? { secu } : {};
      }
      case signa: {
        const review = stringifyQueryParam(params.signa);
        const signa = findActivityReviewerStatusByString(review);
        return signa ? { signa } : {};
      }
      case barrieres: {
        const review = stringifyQueryParam(params.barrieres);
        const barrieres = findActivityReviewerStatusByString(review);
        return barrieres ? { barrieres } : {};
      }
      case elec: {
        const review = stringifyQueryParam(params.elec);
        const elec = findActivityReviewerStatusByString(review);
        return elec ? { elec } : {};
      }
    }
  }
}

export function findStatus(
  status: string,
): FestivalActivity["status"] | undefined {
  if (!status) return undefined;
  switch (status) {
    case IN_REVIEW:
    case VALIDATED:
    case REFUSED:
      return status;
    case DRAFT:
    default:
      return DRAFT;
  }
}
