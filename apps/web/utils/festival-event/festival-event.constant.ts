import type { FestivalActivity, FestivalTask } from "@overbookd/festival-event";
import {
  DRAFT,
  IN_REVIEW,
  READY_TO_ASSIGN,
  REFUSED,
  VALIDATED,
} from "@overbookd/festival-event-constants";

export const BROUILLON = "Brouillon";
export const RELECTURE_EN_COURS = "Relecture en cours";
export const VALIDEE = "Validée";
export const REFUSEE = "Refusée";
export const PRETE_POUR_AFFECTATION = "Prête pour affectation";

export const SEARCH_QUERY_PARAM = "search";
export const ADHERENT_QUERY_PARAM = "adherent";
export const TEAM_QUERY_PARAM = "team";
export const STATUS_QUERY_PARAM = "status";
export const REVIEWER_QUERY_PARAM = "reviewer";
export const NEED_SUPPLY_QUERY_PARAM = "needSupply";

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
