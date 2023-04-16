import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { Period } from "~/utils/models/period";

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
  SET_STATS(state, stats: OrgaNeedsResponse[]) {
    state.stats = formatToStats(stats);
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchStats(context, period: Period): Promise<void> {
      const res = await safeCall(this, orgaNeedsRepo.fetchStats(this, period));
      if (!res) return;
      context.commit("SET_STATS", res.data);
    },
  }
);

function formatToStats(stats: OrgaNeedsResponse[]) {
  return stats.map((stat) => ({
    ...stat,
    start: new Date(stat.start),
    end: new Date(stat.end),
  }));
}
