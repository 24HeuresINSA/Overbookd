import type {
  HttpStringified,
  OrgaNeedDetails,
  OrgaNeedRequest,
} from "@overbookd/http";
import { isHttpError } from "~/utils/http/api-fetch";
import { castPeriodWithDate } from "~/utils/http/period";

type State = {
  stats: OrgaNeedDetails[];
};

export const useOrgaNeedStore = defineStore("orga-need", {
  state: (): State => ({
    stats: [],
  }),
  actions: {
    async fetchStats(periodAndTeams: OrgaNeedRequest) {
      const res = await OrgaNeedRepository.fetchStats(periodAndTeams);
      if (isHttpError(res)) return;
      this.stats = castStatsWithDate(res);
    },
  },
});

function castStatsWithDate(
  stats: HttpStringified<OrgaNeedDetails[]>,
): OrgaNeedDetails[] {
  return stats.map((stat) => ({
    ...stat,
    ...castPeriodWithDate(stat),
  }));
}
