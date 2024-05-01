import { actionTree, mutationTree } from "typed-vuex";
import {
  HttpStringified,
  VolunteerForPlanning as HttpVolunteerForPlanning,
  ICAL,
} from "@overbookd/http";
import { Duration } from "@overbookd/period";
import { User } from "@overbookd/user";
import { safeCall } from "~/utils/api/calls";
import { PlanningRepository } from "~/repositories/planning.repository";
import { Edition } from "@overbookd/contribution";
import { downloadPlanning } from "~/utils/planning/download";

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

type PlanningState = {
  link: string | null;
  planningBase64Data: string;
  volunteers: VolunteerForPlanning[];
};

export const state = (): PlanningState => ({
  link: null,
  planningBase64Data: "",
  volunteers: [],
});

export const mutations = mutationTree(state, {
  SET_LINK(state, link: string) {
    state.link = link;
  },
  SET_PLANNING_DATA(state, planningData: string) {
    state.planningBase64Data = planningData;
  },
  SET_VOLUNTEERS(state, volunteers: VolunteerForPlanning[]) {
    state.volunteers = volunteers;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchSubscriptionLink({ commit }) {
      const res = await safeCall(
        this,
        PlanningRepository.getPlanningSubscriptionLink(this),
      );
      if (!res) return;
      commit("SET_LINK", res.data.link);
    },
    async downloadMyPdfPlanning({ rootState }) {
      const res = await safeCall(this, PlanningRepository.getMyPdf(this));
      if (!res) return;
      const { firstname, lastname, id } = rootState.user.me;
      const volunteer = { firstname, lastname, id };
      downloadPlanning(res.data, volunteer);
    },
    async downloadMyIcalPlanning() {
      const res = await safeCall(this, PlanningRepository.getMyPdf(this));
      if (!res) return;
      downloadIcalFile(res.data);
    },
    async downloadIcalPlanning(_, volunteerId: number) {
      const res = await safeCall(
        this,
        PlanningRepository.getVolunteerIcal(this, volunteerId),
      );
      if (!res) return;
      downloadIcalFile(res.data);
    },
    async downloadAllPdfPlannings(_, volunteers: User[]) {
      const maxRequests = 5;

      for (let i = 0; i < volunteers.length; i += maxRequests) {
        const chunk = volunteers.slice(i, i + maxRequests);
        const plannings = await Promise.all(
          chunk.map(async ({ id, firstname, lastname }) => {
            const res = await safeCall(
              this,
              PlanningRepository.getVolunteerPdf(this, id),
            );
            if (!res) return undefined;
            const volunteer = { firstname, lastname, id };
            const planningBase64Data = `${res.data}`;
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
    async fetchVolunteers({ commit }) {
      const res = await safeCall(this, PlanningRepository.getVolunteers(this));
      if (!res) return;
      const volunteers = res.data.map(castWithAssignmentDuration);
      commit("SET_VOLUNTEERS", volunteers);
    },
  },
);

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
