import { actionTree, mutationTree } from "typed-vuex";
import { safeCall } from "~/utils/api/calls";
import { User } from "@overbookd/user";
import { UserRepository } from "~/repositories/user.repository";
import { Duration } from "@overbookd/period";

export type HasAssignment = {
  assignment: Duration;
};

export type VolunteerForPlanning = User &
  HasAssignment & {
    teams: string[];
  };

type VolunteerWithItPLanning = {
  volunteer: User;
  planningBase64Data: string;
};

export type VolunteerPlanning = {
  volunteer: User;
  planningBase64Data: string;
};

type PlanningState = {
  link: string | null;
  planningBase64Data: string;
  volunteerPlannings: VolunteerPlanning[];
  volunteers: VolunteerForPlanning[];
};

export const state = (): PlanningState => ({
  link: null,
  planningBase64Data: "",
  volunteerPlannings: [],
  volunteers: [],
});

export const mutations = mutationTree(state, {
  SET_LINK(state, link: string) {
    state.link = link;
  },
  SET_PLANNING_DATA(state, planningData: string) {
    state.planningBase64Data = planningData;
  },
  SET_VOLUNTEER_PLANNINGS(state, volunteerPlannings: VolunteerPlanning[]) {
    state.volunteerPlannings = volunteerPlannings;
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
        UserRepository.getPlanningSubscriptionLink(this),
      );
      if (!res) return;
      commit("SET_LINK", res.data.link);
    },
    async fetchMyPdfPlanning({ commit }) {
      const res = await safeCall(this, UserRepository.getMyPdfPlanning(this));
      if (!res) return;
      commit("SET_PLANNING_DATA", res.data);
    },
    async fetchAllPdfPlannings({ commit }, volunteers: User[]) {
      const maxRequests = 5;

      const planningsRes: (VolunteerWithItPLanning | undefined)[] = [];
      for (let i = 0; i < volunteers.length; i += maxRequests) {
        const chunk = volunteers.slice(i, i + maxRequests);
        const plannings = await Promise.all(
          chunk.map(async ({ id, firstname, lastname }) => {
            const res = await safeCall(
              this,
              UserRepository.getPdfPlanning(this, id),
            );
            if (!res) return undefined;
            const volunteer = { firstname, lastname, id };
            const planningBase64Data = `${res.data}`;
            return { volunteer, planningBase64Data };
          }),
        );
        planningsRes.push(...plannings);
      }
      const retrievedPlannings = planningsRes.filter(
        (res): res is VolunteerPlanning => res !== undefined,
      );
      commit("SET_VOLUNTEER_PLANNINGS", retrievedPlannings);
    },
  },
);
