import { actionTree, mutationTree } from "typed-vuex";
import { safeCall } from "~/utils/api/calls";
import {
  HttpStringified,
  OrgaNeedDetails,
  OrgaNeedRequest,
} from "@overbookd/http";
import { OrgaNeedsRepository } from "~/repositories/orga-needs.repository";

type State = {
  stats: OrgaNeedDetails[];
};

export const state = (): State => ({
  stats: [],
});

export const mutations = mutationTree(state, {
  SET_STATS(state, stats: HttpStringified<OrgaNeedDetails[]>) {
    state.stats = formatToStats(stats);
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchStats(
      { commit },
      periodAndTeams: OrgaNeedRequest,
    ): Promise<void> {
      const res = await safeCall(
        this,
        OrgaNeedsRepository.fetchStats(this, periodAndTeams),
      );
      if (!res) return;
      commit("SET_STATS", res.data);
    },
  },
);

function formatToStats(
  stats: HttpStringified<OrgaNeedDetails[]>,
): OrgaNeedDetails[] {
  return stats.map((stat) => ({
    ...stat,
    start: new Date(stat.start),
    end: new Date(stat.end),
  }));
}
