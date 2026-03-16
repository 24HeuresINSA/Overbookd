import type { AssignmentIdentifier } from "@overbookd/assignment";
import {
  type HttpStringified,
  type VolunteerForPlanningLeaflet as HttpVolunteerForPlanningLeaflet,
  ICAL,
  type MultiPlanningVolunteer,
  type TaskForCalendar,
} from "@overbookd/http";
import type { BreakDefinition, BreakIdentifier } from "@overbookd/planning";
import { Duration, Edition, Period } from "@overbookd/time";
import type { User, UserWithTeams } from "@overbookd/user";
import { AssignmentsRepository } from "~/repositories/assignment/assignments.repository";
import { PlanningRepository } from "~/repositories/planning.repository";
import { UserRepository } from "~/repositories/user.repository";
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
      assignmentStats: [],
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
      const res = await PlanningRepository.getMyPdf();
      if (isHttpError(res)) return;

      const userStore = useUserStore();
      const loggedUser = userStore.loggedUser;
      if (!loggedUser) return;
      const { firstname, lastname, id } = loggedUser;
      const volunteer = { firstname, lastname, id };
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
      const maxRequests = 5;

      for (let i = 0; i < volunteers.length; i += maxRequests) {
        const chunk = volunteers.slice(i, i + maxRequests);
        const plannings = await Promise.all(
          chunk.map(async ({ id, firstname, lastname }) => {
            const res = await PlanningRepository.getVolunteerPdf(id);
            if (isHttpError(res)) return undefined;
            const volunteer = { firstname, lastname, id };
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
      const res = await PlanningRepository.getVolunteerBooklet(volunteer.id);
      if (isHttpError(res)) return;
      downloadPdfPlanning(res, volunteer);
    },

    async downloadBookletsPlannings(volunteers: User[]) {
      const res = await PlanningRepository.getVolunteersBooklets(
        volunteers.map(({ id }) => id),
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
        return { ...volunteer, assignments, availabilities, tasks };
      });
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
      const res = await UserRepository.getVolunteerAssignmentStats(userId);
      if (isHttpError(res)) return;
      this.selectedVolunteer.assignmentStats = res;
    },

    async fetchVolunteerBreakPeriods(volunteerId: number) {
      const res = await PlanningRepository.getBreakPeriods(volunteerId);
      if (isHttpError(res)) return;
      this.selectedVolunteer.breakPeriods = res.map((period) =>
        Period.init(castPeriodWithDate(period)),
      );
    },

    async addVolunteerBreakPeriods({
      volunteer,
      during: { start, duration },
    }: BreakDefinition) {
      const during = { start, durationInHours: duration.inHours };
      const res = await PlanningRepository.addBreakPeriod(volunteer, during);
      if (isHttpError(res)) return;

      this.selectedVolunteer.breakPeriods = res.map((period) =>
        Period.init(castPeriodWithDate(period)),
      );
    },

    async deleteVolunteerBreakPeriods({ volunteer, period }: BreakIdentifier) {
      const res = await PlanningRepository.removeBreakPeriod(volunteer, period);
      if (isHttpError(res)) return;
      this.selectedVolunteer.breakPeriods = res.map((period) =>
        Period.init(castPeriodWithDate(period)),
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
