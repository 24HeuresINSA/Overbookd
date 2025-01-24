import {
  type HttpStringified,
  type VolunteerForPlanning as HttpVolunteerForPlanning,
  ICAL,
} from "@overbookd/http";
import { Duration, Edition } from "@overbookd/time";
import type { User } from "@overbookd/user";
import { PlanningRepository } from "~/repositories/planning.repository";
import { downloadPlanning } from "~/utils/file/download-planning.utils";
import { isHttpError } from "~/utils/http/http-error.utils";
import type { FestivalTaskWithConflicts } from "@overbookd/festival-event";
import { DRAFT } from "@overbookd/festival-event-constants";
import { castTaskWithDate } from "~/utils/festival-event/festival-task/festival-task.utils";

export type HasAssignment = {
  assignment: Duration;
};

export type VolunteerForPlanning = User &
  HasAssignment & {
    teams: string[];
  };

type VolunteerPlanning = {
  volunteer: User;
  planningBase64Data: string;
};

// Va servir à initialiser la valeur du Store
const fakeTask: FestivalTaskWithConflicts = {
  id: 0,
  status: DRAFT,
  festivalActivity: {
    id: 0,
    name: "",
    status: DRAFT,
    timeWindows: [],
    location: null,
    hasSupplyRequest: false,
    inquiry: { all: [], timeWindows: [] },
  },
  general: {
    name: "",
    administrator: { id: 0, firstname: "", lastname: "" },
    team: null,
  },
  instructions: {
    contacts: [],
    appointment: null,
    global: null,
    inCharge: { instruction: null, volunteers: [] },
  },
  feedbacks: [],
  inquiries: [],
  history: [],
  mobilizations: [],
};

type State = {
  link: string | null;
  planningBase64Data: string;
  volunteers: VolunteerForPlanning[];
  ft_reader: FestivalTaskWithConflicts;
};

export const usePlanningStore = defineStore("planning", {
  state: (): State => ({
    link: null,
    planningBase64Data: "",
    volunteers: [],
    ft_reader: fakeTask,
  }),
  actions: {
    async getReadFtInfos(id: number) {
      this.ft_reader = fakeTask;
      const res = await PlanningRepository.getReadFtInfos(id);
      if (isHttpError(res)) return;
      this.ft_reader = castTaskWithDate(res);
    },

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
      downloadPlanning(res, volunteer);
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
            downloadPlanning(planningBase64Data, volunteer),
          );
      }
    },

    async fetchVolunteers() {
      const res = await PlanningRepository.getVolunteers();
      if (isHttpError(res)) return;
      const volunteers = res.map(castWithAssignmentDuration);
      this.volunteers = volunteers;
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
  volunteer: HttpStringified<HttpVolunteerForPlanning>,
): VolunteerForPlanning {
  return { ...volunteer, assignment: Duration.ms(volunteer.assignment) };
}
