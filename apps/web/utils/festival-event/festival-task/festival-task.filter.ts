import { DRAFT, FestivalTask } from "@overbookd/festival-event";
import { User } from "@overbookd/user";
import { Team } from "../../models/team.model";
import { strigifyQueryParam } from "../festival-event.filter";

export type TaskFilters = {
  search?: string;
  team?: Team;
  adherent?: User;
  status?: FestivalTask["status"];
};

type QueryParamsValue = string | (string | null)[];

type IsNotEmpty = (value: string) => string | undefined;
type IsExistingStatus = (value: string) => FestivalTask["status"] | undefined;
type IsExistingTeam = (value: string) => Team | undefined;
type IsExistingAdherent = (id: User["id"]) => User | undefined;

type InitFilterBuilder = {
  isNotEmpty: IsNotEmpty;
  isExistingStatus: IsExistingStatus;
  isExistingTeam: IsExistingTeam;
  isExistingAdherent: IsExistingAdherent;
};

export class TaskFilterBuilder {
  private constructor(
    private readonly isNotEmpty: IsNotEmpty,
    private readonly isExistingStatus: IsExistingStatus,
    private readonly isExistingTeam: IsExistingTeam,
    private readonly isExistingAdherent: IsExistingAdherent,
  ) {}

  static init(initializer: InitFilterBuilder) {
    return new TaskFilterBuilder(
      initializer.isNotEmpty,
      initializer.isExistingStatus,
      initializer.isExistingTeam,
      initializer.isExistingAdherent,
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
    }
  }
}

export function findStatus(status: string): FestivalTask["status"] | undefined {
  if (!status) return undefined;
  switch (status) {
    case DRAFT:
    default:
      return DRAFT;
  }
}
