import { actionTree, mutationTree, getterTree } from "typed-vuex";
import { SlugifyService } from "~/domain/common/slugify.service";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { ONE_HOUR_IN_MS, ONE_MINUTE_IN_MS } from "~/utils/date/dateUtils";
import { Period, castPeriod } from "~/utils/models/period";
import { TimelineEvent } from "~/utils/models/timeline";
import { HttpStringified } from "~/utils/types/http";

const QUARTER_IN_MS = ONE_MINUTE_IN_MS * 15;
const TWO_HOURS_IN_MS = ONE_HOUR_IN_MS * 2;

const timelineRepo = RepoFactory.TimelineRepository;

type WithName = {
  name: string;
};

interface TimelineState {
  events: TimelineEvent[];
  start: Date;
  end: Date;
  search: string;
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
  search: "",
});

export const getters = getterTree(state, {
  period(state): Period {
    return { start: state.start, end: state.end };
  },
  filteredEvents(state): TimelineEvent[] {
    const faMatchingSearch = state.events.filter(({ fa }) =>
      isMatchingSearchedName(fa, state.search)
    );
    const ftsMatchingSearch = filterFasWithTasksMatchingSearch(
      state.events,
      state.search
    );
    return [...faMatchingSearch, ...ftsMatchingSearch].sort(
      (a, b) => a.fa.id - b.fa.id
    );
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
  SET_SEARCH(state, search: string) {
    state.search = search;
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
    updateSearch({ commit }, search: string | null) {
      commit("SET_SEARCH", search ?? "");
    },
  }
);

function filterFasWithTasksMatchingSearch(
  fas: TimelineEvent[],
  search: string
) {
  const faNotMatchingSearch = fas.filter(({ fa }) => {
    return !isMatchingSearchedName(fa, search);
  });
  return faNotMatchingSearch
    .filter(({ fts }) => {
      return fts.some((ft) => isMatchingSearchedName(ft, search));
    })
    .map((event) => ({
      ...event,
      fts: event.fts.filter((ft) => isMatchingSearchedName(ft, search)),
    }));
}

function isMatchingSearchedName(event: WithName, search: string): boolean {
  return SlugifyService.apply(event.name).includes(
    SlugifyService.apply(search)
  );
}

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
