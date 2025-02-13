import type { FestivalActivity, FestivalTask } from "@overbookd/festival-event";
import {
  BROUILLON,
  DRAFT,
  IN_REVIEW,
  PRETE_POUR_AFFECTATION,
  READY_TO_ASSIGN,
  REFUSED,
  REFUSEE,
  RELECTURE_EN_COURS,
  VALIDATED,
  VALIDEE,
} from "@overbookd/festival-event-constants";

export const SEARCH_QUERY_PARAM = "search";
export const ADHERENT_QUERY_PARAM = "adherent";
export const TEAM_QUERY_PARAM = "team";
export const STATUS_QUERY_PARAM = "status";
export const REVIEWER_QUERY_PARAM = "reviewer";
export const NEED_SUPPLY_QUERY_PARAM = "needSupply";
export const ITEMS_PER_PAGE_QUERY_PARAM = "itemsPerPage";

export function findStatusByLabel(
  status: string,
): FestivalActivity["status"] | FestivalTask["status"] | undefined {
  if (!status) return undefined;
  switch (status) {
    case BROUILLON:
      return DRAFT;
    case RELECTURE_EN_COURS:
      return IN_REVIEW;
    case VALIDEE:
      return VALIDATED;
    case REFUSEE:
      return REFUSED;
    case PRETE_POUR_AFFECTATION:
      return READY_TO_ASSIGN;
    default:
      return undefined;
  }
}
