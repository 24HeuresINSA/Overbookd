import {
  type HttpStringified,
  type VolunteerForPlanning as HttpVolunteerForPlanning,
  ICAL,
} from "@overbookd/http";
import { Duration, Edition } from "@overbookd/time";
import type { User } from "@overbookd/user";
import { PlanningRepository } from "~/repositories/planning.repository";
import {
  downloadPdfFromBase64,
  downloadPdfPlanning,
} from "~/utils/file/download-planning.utils";
import { isHttpError } from "~/utils/http/http-error.utils";

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

type State = {
  link: string | null;
  volunteers: VolunteerForPlanning[];
};

export const usePlanningStore = defineStore("planning", {
  state: (): State => ({
    link: null,
    volunteers: [],
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
