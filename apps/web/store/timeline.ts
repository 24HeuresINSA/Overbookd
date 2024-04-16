import { actionTree, getterTree, mutationTree } from "typed-vuex";
import {
  IProvidePeriod,
  TWO_HOURS_IN_MS,
  QUARTER_IN_MS,
  Period,
} from "@overbookd/period";
import { SlugifyService } from "@overbookd/slugify";
import { safeCall } from "~/utils/api/calls";
import { Team } from "~/utils/models/team.model";
import {
  HttpStringified,
  TimelineEvent,
  TimelineMobilization,
  TimelineTask,
} from "@overbookd/http";
import { TimelineRepository } from "~/repositories/timeline.repository";
import { castPeriodWithDate, castPeriodsWithDate } from "~/utils/http/period";

type WithName = {
  name: string;
};

type TimelineState = {
  events: TimelineEvent[];
  start: Date;
  end: Date;
  search: string;
  teams: Team[];
};

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
});

export const getters = getterTree(state, {
  period({ start, end }): Period {
    return Period.init({ start, end });
  },
  filteredEvents(state): TimelineEvent[] {
    const activitiesMatchingTeams = filterActivitiesMatchingTeams(state);
    const activitiesMatchingSearch = activitiesMatchingTeams.filter(
      ({ activity }) => isMatchingSearchedName(activity, state.search),
    );
    const tasksMatchingSearch = filterActivitiesWithTasksMatchingSearch(
      activitiesMatchingTeams,
      state.search,
    );
    return [...activitiesMatchingSearch, ...tasksMatchingSearch].sort(
      (a, b) => a.activity.id - b.activity.id,
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
  SET_TEAMS(state, teams: Team[]) {
    state.teams = teams;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchEvents({ commit, getters }) {
      const res = await safeCall(
        this,
        TimelineRepository.getEvents(this, getters.period),
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
    resetToDefaultPeriod({ dispatch }) {
      const period = defaultPeriod();
      dispatch("updatePeriod", period);
    },
  },
);

function filterActivitiesMatchingTeams({ teams, events }: TimelineState) {
  const teamsCode = teams.map(({ code }) => code);
  const activityMatchingTeams =
    teamsCode.length === 0
      ? [...events]
      : events.filter(({ activity }) => teamsCode.includes(activity.team));
  return activityMatchingTeams;
}

function filterActivitiesWithTasksMatchingSearch(
  activities: TimelineEvent[],
  search: string,
) {
  const activityNotMatchingSearch = activities.filter(({ activity }) => {
    return !isMatchingSearchedName(activity, search);
  });
  return activityNotMatchingSearch
    .filter(({ tasks }) => {
      return tasks.some((task) => isMatchingSearchedName(task, search));
    })
    .map((event) => ({
      ...event,
      tasks: event.tasks.filter((task) => isMatchingSearchedName(task, search)),
    }));
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
    tasks: event.tasks.map(castTimelineTaskWithDate),
  };
}

function castTimelineTaskWithDate(
  task: HttpStringified<TimelineTask>,
): TimelineTask {
  return {
    ...task,
    mobilizations: task.mobilizations.map(castTimelineMobilizationWithDate),
  };
}

function castTimelineMobilizationWithDate(
  mobilization: HttpStringified<TimelineMobilization>,
): TimelineMobilization {
  return {
    ...mobilization,
    ...castPeriodWithDate(mobilization),
    assignments: castPeriodsWithDate(mobilization.assignments),
  };
}
