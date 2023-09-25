import { actionTree, getterTree, mutationTree } from "typed-vuex";
import {
  IProvidePeriod,
  TWO_HOURS_IN_MS,
  QUARTER_IN_MS,
} from "@overbookd/period";
import { SlugifyService } from "@overbookd/slugify";
import { RepoFactory } from "~/repositories/repo-factory";
import { safeCall } from "~/utils/api/calls";
import { castPeriod } from "~/utils/models/period.model";
import { Team } from "~/utils/models/team.model";
import {
  TimelineEvent,
  TimelineFt,
  TimelineTimeSpan,
  TimelineTimeWindow,
} from "~/utils/models/timeline.model";
import { HttpStringified } from "@overbookd/http";

const timelineRepo = RepoFactory.TimelineRepository;

type WithName = {
  name: string;
};

interface TimelineState {
  events: TimelineEvent[];
  start: Date;
  end: Date;
  search: string;
  teams: Team[];
  owner: number | null;
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
  teams: [],
  owner: null,
});

export const getters = getterTree(state, {
  period(state): IProvidePeriod {
    return { start: state.start, end: state.end };
  },
  filteredEvents(state): TimelineEvent[] {
    const fasMatchingTeams = filterFasMatchingTeams(state);
    const fasMatchingSearch = fasMatchingTeams.filter(({ fa }) =>
      isMatchingSearchedName(fa, state.search),
    );
    const ftsMatchingSearch = filterFasWithTasksMatchingSearch(
      fasMatchingTeams,
      state.search,
    );
    const fasWithFts = [...fasMatchingSearch, ...ftsMatchingSearch];
    const eventsMatchingInCharge = filterEventsMatchingInCharge(
      fasWithFts,
      state.owner,
    );
    return eventsMatchingInCharge.sort((a, b) => a.fa.id - b.fa.id);
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
  SET_TEAMS(state, teams: Team[]) {
    state.teams = teams;
  },
  SET_OWNER(state, ownerId: number | null) {
    state.owner = ownerId;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchEvents({ commit, getters }) {
      const res = await safeCall(
        this,
        timelineRepo.getEvents(this, getters.period),
      );
      if (!res) return;
      const events = castTimelineEventsWithDate(res.data);
      commit("SET_EVENTS", events);
    },
    updatePeriod({ commit, dispatch }, { start, end }: IProvidePeriod) {
      commit("SET_START", start);
      commit("SET_END", end);
      dispatch("fetchEvents");
    },
    updateSearch({ commit }, search: string | null) {
      commit("SET_SEARCH", search ?? "");
    },
    updateTeams({ commit }, teams: Team[]) {
      commit("SET_TEAMS", teams);
    },
    updateOwner({ commit }, ownerId: number | null) {
      commit("SET_OWNER", ownerId);
    },
    resetToDefaultPeriod({ dispatch }) {
      const period = defaultPeriod();
      dispatch("updatePeriod", period);
    },
  },
);

function filterFasMatchingTeams({ teams, events }: TimelineState) {
  const teamsCode = teams.map(({ code }) => code);
  const faMatchingTeams =
    teamsCode.length === 0
      ? [...events]
      : events.filter(({ fa }) => teamsCode.includes(fa.team));
  return faMatchingTeams;
}

function filterFasWithTasksMatchingSearch(
  fas: TimelineEvent[],
  search: string,
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

function filterEventsMatchingInCharge(
  events: TimelineEvent[],
  ownerId: number | null,
) {
  if (!ownerId) return events;
  return events
    .map((event) => ({
      ...event,
      fts: event.fts.filter((ft) => ft.owner === ownerId),
    }))
    .filter((event) => event.fts.length > 0);
}

function isMatchingSearchedName(event: WithName, search: string): boolean {
  return SlugifyService.apply(event.name).includes(
    SlugifyService.apply(search),
  );
}

function castTimelineEventsWithDate(
  timelineEvents: HttpStringified<TimelineEvent[]>,
): TimelineEvent[] {
  return timelineEvents.map(castTimelineEventWithDate);
}

function castTimelineEventWithDate(
  event: HttpStringified<TimelineEvent>,
): TimelineEvent {
  return {
    ...event,
    fts: event.fts.map(castTimelineFtWithDate),
  };
}

function castTimelineFtWithDate(ft: HttpStringified<TimelineFt>): TimelineFt {
  return {
    ...ft,
    timeWindows: ft.timeWindows.map(castTimelineTimeWindowWithDate),
  };
}

function castTimelineTimeWindowWithDate(
  timeWindow: HttpStringified<TimelineTimeWindow>,
): TimelineTimeWindow {
  return {
    ...timeWindow,
    ...castPeriod(timeWindow),
    timeSpans: timeWindow.timeSpans.map(castTimelineTimeSpanWithDate),
  };
}

function castTimelineTimeSpanWithDate(
  timeSpan: HttpStringified<TimelineTimeSpan>,
): TimelineTimeSpan {
  return {
    ...timeSpan,
    ...castPeriod(timeSpan),
  };
}
