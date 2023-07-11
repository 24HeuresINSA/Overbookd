import { actionTree, mutationTree } from "typed-vuex";
import { Period } from "@overbookd/period";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { HttpStringified } from "~/utils/types/http";

const orgaNeedsRepo = RepoFactory.OrgaNeedsRepository;

export interface OrgaNeedsResponse {
  start: Date;
  end: Date;
  assignedVolunteers: number;
  availableVolunteers: number;
  requestedVolunteers: number;
}

interface State {
  stats: OrgaNeedsResponse[];
}

export const state = (): State => ({
  stats: [],
});

export const mutations = mutationTree(state, {
  SET_STATS(state, stats: HttpStringified<OrgaNeedsResponse[]>) {
    state.stats = formatToStats(stats);
  },
});

export type OrgaNeedsRequest = Period & {
  teams: string[];
};

export const actions = actionTree(
  { state, mutations },
  {
    async fetchStats(context, periodAndTeams: OrgaNeedsRequest): Promise<void> {
      const res = await safeCall(
        this,
        orgaNeedsRepo.fetchStats(this, periodAndTeams)
      );
      if (!res) return;
      context.commit("SET_STATS", res.data);
    },
  }
);

function formatToStats(
  stats: HttpStringified<OrgaNeedsResponse[]>
): OrgaNeedsResponse[] {
  return stats.map((stat) => ({
    ...stat,
    start: new Date(stat.start),
    end: new Date(stat.end),
  }));
}
