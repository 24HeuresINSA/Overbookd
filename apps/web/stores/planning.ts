import type {
  AssignmentIdentifier,
  BreakDefinition,
  BreakIdentifier,
} from "@overbookd/assignment";
import {
  type HttpStringified,
  type VolunteerForPlanningLeaflet as HttpVolunteerForPlanningLeaflet,
  ICAL,
  type MultiPlanningVolunteer,
  type TaskForCalendar,
} from "@overbookd/http";
import { Duration, Edition } from "@overbookd/time";
import type { User, UserWithTeams } from "@overbookd/user";
import { AssignmentsRepository } from "~/repositories/assignment/assignments.repository";
import { PlanningRepository } from "~/repositories/planning.repository";
import { UserRepository } from "~/repositories/user.repository";
import { CalendarEventPeriods } from "~/utils/availabilities/calendar-event-periods";
import {
  downloadPdfFromBase64,
  downloadPdfPlanning,
} from "~/utils/file/download-planning.utils";
import {
  castPeriodsWithDate,
  castPeriodWithDate,
} from "~/utils/http/cast-date/period.utils";
import {
  castAssignmentEventsWithDate,
  castBreakPeriodWithDate,
  castVolunteerPlanningTasksWithDate,
} from "~/utils/http/cast-date/planning.utils";
import { isHttpError } from "~/utils/http/http-error.utils";
import type { VolunteerForPlanningCalendar } from "~/utils/planning/volunteer";

export type HasAssignment = {
  assignment: Duration;
};

export type VolunteerForPlanningLeaflet = UserWithTeams & HasAssignment;

type VolunteerPlanning = {
  volunteer: User;
  planningBase64Data: string;
};

type State = {
  link: string | null;
  leafletVolunteers: VolunteerForPlanningLeaflet[];
  multiPlanningVolunteers: MultiPlanningVolunteer[];
  selectedVolunteer: VolunteerForPlanningCalendar;
  selectedCalendarTask?: TaskForCalendar;
};

export const usePlanningStore = defineStore("planning", {
  state: (): State => ({
    link: null,
    leafletVolunteers: [],
    multiPlanningVolunteers: [],
    selectedVolunteer: {
      breakPeriods: [],
      tasks: [],
      assignmentStats: undefined,
      assignments: [],
    },
    selectedCalendarTask: undefined,
  }),
  actions: {
    async fetchSubscriptionLink() {
      const res = await PlanningRepository.getPlanningSubscriptionLink();
      if (isHttpError(res)) return;
      this.link = res.link;
    },

    async downloadMyPdfPlanning() {
      const prePreManifStart = CalendarEventPeriods.prePreManif.period.start;
      const res = await PlanningRepository.getMyPdf(prePreManifStart);
      if (isHttpError(res)) return;

      const userStore = useUserStore();
      const loggedUser = userStore.loggedUser;
      if (!loggedUser) return;
      const { firstName, lastName, id } = loggedUser;
      const volunteer = { firstName, lastName, id };
      downloadPdfPlanning(res, volunteer);
    },

    async downloadMyIcalPlanning() {
      const res = await PlanningRepository.getMyIcal();
      if (isHttpError(res)) return;
      downloadIcalFile(res);
    },

    async downloadIcalPlanning(volunteerId: number) {
      const res = await PlanningRepository.getVolunteerIcal(volunteerId);
      if (isHttpError(res)) return;
      downloadIcalFile(res);
    },

    async downloadAllPdfPlannings(volunteers: User[]) {
      const prePreManifStart = CalendarEventPeriods.prePreManif.period.start;
      const maxRequests = 5;

      for (let i = 0; i < volunteers.length; i += maxRequests) {
        const chunk = volunteers.slice(i, i + maxRequests);
        const plannings = await Promise.all(
          chunk.map(async ({ id, firstName, lastName }) => {
            const res = await PlanningRepository.getVolunteerPdf(
              id,
              prePreManifStart,
            );
            if (isHttpError(res)) return undefined;
            const volunteer = { firstName, lastName, id };
            const planningBase64Data = `${res}`;
            return { volunteer, planningBase64Data };
          }),
        );
        plannings
          .filter((res): res is VolunteerPlanning => res !== undefined)
          .map(({ volunteer, planningBase64Data }) =>
            downloadPdfPlanning(planningBase64Data, volunteer),
          );
      }
    },

    async downloadBookletPlanning(volunteer: User) {
      const prePreManifStart = CalendarEventPeriods.prePreManif.period.start;
      const res = await PlanningRepository.getVolunteerBooklet(
        volunteer.id,
        prePreManifStart,
      );
      if (isHttpError(res)) return;
      downloadPdfPlanning(res, volunteer);
    },

    async downloadBookletsPlannings(volunteers: User[]) {
      const prePreManifStart = CalendarEventPeriods.prePreManif.period.start;
      const res = await PlanningRepository.getVolunteersBooklets(
        volunteers.map(({ id }) => id),
        prePreManifStart,
      );
      if (isHttpError(res)) return;
      downloadPdfFromBase64(res, "plannings.pdf");
    },

    async fetchVolunteersForLeaflets() {
      const res = await PlanningRepository.getVolunteersForLeaflets();
      if (isHttpError(res)) return;
      const volunteers = res.map(castWithAssignmentDuration);
      this.leafletVolunteers = volunteers;
    },

    async getVolunteersForMultiPlanning(volunteerIds: number[]) {
      const res =
        await PlanningRepository.getVolunteersForMultiPlanning(volunteerIds);
      if (isHttpError(res)) return;
      this.multiPlanningVolunteers = res.map((volunteer) => {
        const assignments = volunteer.assignments.map((assignment) => ({
          ...assignment,
          start: new Date(assignment.start),
          end: new Date(assignment.end),
        }));
        const availabilities = castPeriodsWithDate(volunteer.availabilities);
        const tasks = volunteer.tasks.map((task) => ({
          ...task,
          timeWindow: castPeriodWithDate(task.timeWindow),
        }));
        const breaks = volunteer.breaks?.map(castBreakPeriodWithDate);
        return { ...volunteer, assignments, availabilities, tasks, breaks };
      });
    },

    clearSelectedVolunteer() {
      this.selectedVolunteer.breakPeriods = [];
      this.selectedVolunteer.tasks = [];
      this.selectedVolunteer.assignmentStats = undefined;
      this.selectedVolunteer.assignments = [];
    },

    async fetchVolunteerTasks(volunteerId: number) {
      const res =
        await UserRepository.getMobilizationsVolunteerTakePartOf(volunteerId);
      if (isHttpError(res)) return;
      this.selectedVolunteer.tasks = castVolunteerPlanningTasksWithDate(res);
    },

    async fetchVolunteerAssignments(userId: number) {
      const res = await UserRepository.getVolunteerAssignments(userId);
      if (isHttpError(res)) return;
      this.selectedVolunteer.assignments = castAssignmentEventsWithDate(res);
    },

    async fetchVolunteerAssignmentDetails(identifier: AssignmentIdentifier) {
      const res = await AssignmentsRepository.findOneForCalendar(identifier);
      if (isHttpError(res)) return;
      this.selectedCalendarTask = {
        ...res,
        timeWindow: castPeriodWithDate(res.timeWindow),
      };
    },

    async fetchVolunteerAssignmentStats(userId: number) {
      const res =
        await AssignmentsRepository.fetchOneVolunteerAssignmentStats(userId);
      if (isHttpError(res)) return;
      this.selectedVolunteer.assignmentStats = res;
    },

    async fetchVolunteerBreakPeriods(volunteerId: number) {
      const res = await PlanningRepository.getBreakPeriods(volunteerId);
      if (isHttpError(res)) return;
      this.selectedVolunteer.breakPeriods = res.map((breakPeriod) =>
        castBreakPeriodWithDate(breakPeriod),
      );
    },

    async addVolunteerBreakPeriods({
      volunteer,
      name,
      during: { start, duration },
    }: BreakDefinition) {
      const during = { start, durationInHours: duration.inHours };
      const newBreak = { name, ...during };
      const res = await PlanningRepository.addBreakPeriod(volunteer, newBreak);
      if (isHttpError(res)) return;

      this.selectedVolunteer.breakPeriods = res.map((breakPeriod) =>
        castBreakPeriodWithDate(breakPeriod),
      );
    },

    async deleteVolunteerBreakPeriods({ volunteer, period }: BreakIdentifier) {
      const res = await PlanningRepository.removeBreakPeriod(volunteer, period);
      if (isHttpError(res)) return;
      this.selectedVolunteer.breakPeriods = res.map((breakPeriod) =>
        castBreakPeriodWithDate(breakPeriod),
      );
    },
  },
});

function downloadIcalFile(content: string) {
  const icalBlob = new Blob([content], { type: ICAL });
  const icalUrl = URL.createObjectURL(icalBlob);

  const icalLink = document.createElement("a");
  icalLink.href = icalUrl;
  icalLink.download = `Planning 24 Heures de l'INSA - ${Edition.current}e`;
  icalLink.click();
  URL.revokeObjectURL(icalUrl);
}

function castWithAssignmentDuration(
  volunteer: HttpStringified<HttpVolunteerForPlanningLeaflet>,
): VolunteerForPlanningLeaflet {
  return { ...volunteer, assignment: Duration.ms(volunteer.assignment) };
}
