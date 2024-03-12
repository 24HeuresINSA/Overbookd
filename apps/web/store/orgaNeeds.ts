import { actionTree, mutationTree } from "typed-vuex";
import { IProvidePeriod } from "@overbookd/period";
import { safeCall } from "~/utils/api/calls";
import { HttpStringified } from "@overbookd/http";
import { OrgaNeedsRepository } from "~/repositories/orga-needs.repository";

export type OrgaNeedsResponse = {
  start: Date;
  end: Date;
  assignedVolunteers: number;
  availableVolunteers: number;
  requestedVolunteers: number;
};

type State = {
  stats: OrgaNeedsResponse[];
};

export const state = (): State => ({
  stats: [],
});

export const mutations = mutationTree(state, {
  SET_STATS(state, stats: HttpStringified<OrgaNeedsResponse[]>) {
    state.stats = formatToStats(stats);
  },
});

export type OrgaNeedsRequest = IProvidePeriod & {
  teams: string[];
};

export const actions = actionTree(
  { state, mutations },
  {
    async fetchStats(
      { commit },
      periodAndTeams: OrgaNeedsRequest,
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
  stats: HttpStringified<OrgaNeedsResponse[]>,
): OrgaNeedsResponse[] {
  return stats.map((stat) => ({
    ...stat,
    start: new Date(stat.start),
    end: new Date(stat.end),
  }));
}
