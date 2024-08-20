import {
  APPROVED,
  barrieres,
  communication,
  elec,
  type FestivalActivity,
  humain,
  matos,
  NOT_ASKING_TO_REVIEW,
  REJECTED,
  REVIEWING,
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

export type ActivityReviewsFilter = {
  humain?: ReviewStatus;
  communication?: ReviewStatus;
  matos?: ReviewStatus;
  secu?: ReviewStatus;
  signa?: ReviewStatus;
  barrieres?: ReviewStatus;
  elec?: ReviewStatus;
};

export type ActivityFilters = ActivityReviewsFilter & {
  search?: string;
  team?: Team;
  adherent?: User;
  status?: FestivalActivity["status"];
};

export class ActivityFilterBuilder {
  static getFromRouteQuery(query: LocationQuery): ActivityFilters {
    const search = this.extractQueryParamsValue(query, "search");
    const team = this.extractQueryParamsValue(query, "team");
    const adherent = this.extractQueryParamsValue(query, "adherent");
    const status = this.extractQueryParamsValue(query, "status");
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
      case "humain": {
        const review = stringifyQueryParam(params.humain);
        const humain = findReviewStatus(review);
        return humain ? { humain } : {};
      }
      case "communication": {
        const review = stringifyQueryParam(params.communication);
        const communication = findReviewStatus(review);
        return communication ? { communication } : {};
      }
      case "matos": {
        const review = stringifyQueryParam(params.matos);
        const matos = findReviewStatus(review);
        return matos ? { matos } : {};
      }
      case "secu": {
        const review = stringifyQueryParam(params.secu);
        const secu = findReviewStatus(review);
        return secu ? { secu } : {};
      }
      case "signa": {
        const review = stringifyQueryParam(params.signa);
        const signa = findReviewStatus(review);
        return signa ? { signa } : {};
      }
      case "barrieres": {
        const review = stringifyQueryParam(params.barrieres);
        const barrieres = findReviewStatus(review);
        return barrieres ? { barrieres } : {};
      }
      case "elec": {
        const review = stringifyQueryParam(params.elec);
        const elec = findReviewStatus(review);
        return elec ? { elec } : {};
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
    case REFUSED:
      return REFUSED;
    case DRAFT:
    default:
      return DRAFT;
  }
}
