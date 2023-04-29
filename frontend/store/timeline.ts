import { actionTree, mutationTree, getterTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { ONE_HOUR_IN_MS, ONE_MINUTE_IN_MS } from "~/utils/date/dateUtils";
import { Period, castPeriod } from "~/utils/models/period";
import { TimelineEvent } from "~/utils/models/timeline";
import { HttpStringified } from "~/utils/types/http";

const QUARTER_IN_MS = ONE_MINUTE_IN_MS * 15;
const TWO_HOURS_IN_MS = ONE_HOUR_IN_MS * 2;

const timelineRepo = RepoFactory.TimelineRepository;

interface TimelineState {
  events: TimelineEvent[];
  start: Date;
  end: Date;
}

function defaultPeriod() {
  const currentDate = new Date();

  const previousQuarterStep = Math.floor(currentDate.getTime() / QUARTER_IN_MS);
  const previousQuarterInMs = previousQuarterStep * QUARTER_IN_MS;
  const endPeriodInMs = previousQuarterInMs + TWO_HOURS_IN_MS;

  const start = new Date(previousQuarterInMs);
  const end = new Date(endPeriodInMs);

  return { start, end };
}

export const state = (): TimelineState => ({
  events: [],
  start: defaultPeriod().start,
  end: defaultPeriod().end,
});

export const getters = getterTree(state, {
  period(state): Period {
    return { start: state.start, end: state.end };
  },
});

export const mutations = mutationTree(state, {
  SET_EVENTS(state, events: TimelineEvent[]) {
    state.events = events;
  },
  SET_START(state, start: Date) {
    state.start = start;
  },
  SET_END(state, end: Date) {
    state.end = end;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchEvents({ commit, getters }) {
      const res = await safeCall(
        this,
        timelineRepo.getEvents(this, getters.period)
      );
      if (!res) return;
      const events = castTimelineEventsWithDate(res.data);
      commit("SET_EVENTS", events);
    },
    updatePeriod({ commit, dispatch }, { start, end }: Period) {
      commit("SET_START", start);
      commit("SET_END", end);
      dispatch("fetchEvents");
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
