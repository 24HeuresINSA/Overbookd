import { actionTree, mutationTree, getterTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { ONE_HOUR_IN_MS, QUARTER_IN_MS } from "~/utils/date/dateUtils";
import { Volunteer } from "~/utils/models/needHelp";
import { Period } from "~/utils/models/period";

interface NeedHelpState {
  volunteers: Volunteer[];
  start: Date;
  end: Date;
}

function defaultPeriod() {
  const currentDate = new Date();

  const previousQuarterStep = Math.ceil(currentDate.getTime() / QUARTER_IN_MS);
  const previousQuarterInMs = previousQuarterStep * QUARTER_IN_MS;
  const endPeriodInMs = previousQuarterInMs + ONE_HOUR_IN_MS;

  const start = new Date(previousQuarterInMs);
  const end = new Date(endPeriodInMs);

  return { start, end };
}

const repository = RepoFactory.NeedHelpRepository;

export const state = (): NeedHelpState => ({
  volunteers: [],
  start: defaultPeriod().start,
  end: defaultPeriod().end,
});

export const getters = getterTree(state, {
  period(state): Period {
    return { start: state.start, end: state.end };
  },
});

export const mutations = mutationTree(state, {
  SET_VOLUNTEERS(state, volunteers: Volunteer[]) {
    state.volunteers = volunteers;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchVolunteers({ commit, getters }) {
      const res = await safeCall(
        this,
        repository.getAvailableVolunteers(this, getters.period)
      );
      if (!res) return;
      commit("SET_VOLUNTEERS", res.data);
    },
  }
);
