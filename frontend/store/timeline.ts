import { actionTree, mutationTree, getterTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { Period, castPeriod } from "~/utils/models/period";
import { TimelineEvent } from "~/utils/models/timeline";
import { HttpStringified } from "~/utils/types/http";

const timelineRepo = RepoFactory.TimelineRepository;

interface TimelineState {
  events: TimelineEvent[];
}

const defaultPeriod = {
  start: new Date("2023-05-13 06:00"),
  end: new Date("2023-05-13 08:00"),
};

export const state = (): TimelineState => ({
  events: [],
});

export const getters = getterTree(state, {
  period(): Period {
    return defaultPeriod;
  },
});

export const mutations = mutationTree(state, {
  SET_EVENTS(state, events: TimelineEvent[]) {
    state.events = events;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchEvents({ commit }) {
      const res = await safeCall(
        this,
        timelineRepo.getEvents(this, defaultPeriod)
      );
      if (!res) return;
      const events = castTimelineEventsWithDate(res.data);
      commit("SET_EVENTS", events);
    },
  }
);

function castTimelineEventsWithDate(
  timelineEvents: HttpStringified<TimelineEvent[]>
): TimelineEvent[] {
  return timelineEvents.map((event) => {
    return {
      ...event,
      fts: event.fts.map((ft) => {
        return {
          ...ft,
          timespans: ft.timespans.map(castPeriod),
        };
      }),
    };
  });
}
