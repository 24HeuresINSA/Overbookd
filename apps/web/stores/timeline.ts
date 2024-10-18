import {
  type IProvidePeriod,
  TWO_HOURS_IN_MS,
  QUARTER_IN_MS,
  Period,
} from "@overbookd/time";
import { SlugifyService } from "@overbookd/slugify";
import type {
  HttpStringified,
  TimelineAssignment,
  TimelineEvent,
  TimelineMobilization,
  TimelineTask,
} from "@overbookd/http";
import type { Team } from "@overbookd/team";
import { castPeriodWithDate } from "~/utils/http/cast-date/period.utils";
import { isHttpError } from "~/utils/http/http-error.utils";
import { TimelineRepository } from "~/repositories/timeline.repository";

type WithName = {
  name: string;
};

type State = {
  events: TimelineEvent[];
  start: Date;
  end: Date;
  search: string;
  teams: Team[];
};

export const useTimelineStore = defineStore("timeline", {
  state: (): State => ({
    events: [],
    start: defaultPeriod().start,
    end: defaultPeriod().end,
    search: "",
    teams: [],
  }),
  getters: {
    period(state): Period {
      return Period.init({ start: state.start, end: state.end });
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
  },
  actions: {
    async fetchEvents() {
      const res = await TimelineRepository.getEvents(this.period);
      if (isHttpError(res)) return;
      this.events = res.map(castTimelineEventWithDate);
    },
    async updatePeriod({ start, end }: IProvidePeriod) {
      this.start = start;
      this.end = end;
      await this.fetchEvents();
    },
    updateSearch(search: string | null) {
      this.search = search ?? "";
    },
    updateTeams(teams: Team[]) {
      this.teams = teams;
    },
    async resetToDefaultPeriod() {
      this.start = defaultPeriod().start;
      this.end = defaultPeriod().end;
      await this.fetchEvents();
    },
  },
});

function defaultPeriod() {
  const currentDate = new Date();

  const previousQuarterStep = Math.floor(currentDate.getTime() / QUARTER_IN_MS);
  const previousQuarterInMs = previousQuarterStep * QUARTER_IN_MS;
  const endPeriodInMs = previousQuarterInMs + TWO_HOURS_IN_MS;

  const start = new Date(previousQuarterInMs);
  const end = new Date(endPeriodInMs);

  return { start, end };
}

function filterActivitiesMatchingTeams({ teams, events }: State) {
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
    assignments: mobilization.assignments.map(castTimelineAssignmentWithDate),
  };
}

function castTimelineAssignmentWithDate(
  assignment: HttpStringified<TimelineAssignment>,
): TimelineAssignment {
  return {
    assignees: assignment.assignees,
    ...castPeriodWithDate(assignment),
  };
}
