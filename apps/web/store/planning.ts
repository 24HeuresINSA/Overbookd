import { actionTree, mutationTree } from 'typed-vuex';
import { RepoFactory } from '~/repositories/repo-factory';
import { safeCall } from '~/utils/api/calls';
import { User } from '~/utils/models/user';

const userRepo = RepoFactory.UserRepository;

type VolunteerPlanning = {
  volunteer: User;
  planningBase64Data: string;
};

export const state = () => ({
  link: null as string | null,
  planningBase64Data: '',
  volunteerPlannings: [] as VolunteerPlanning[],
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
});

export const actions = actionTree(
  { state },
  {
    async fetchSubscriptionLink({ commit }) {
      const res = await safeCall(
        this,
        userRepo.getPlanningSubscriptionLink(this)
      );
      if (!res) return;
      commit('SET_LINK', res.data.link);
    },
    async fetchMyPdfPlanning({ commit }) {
      const res = await safeCall(this, userRepo.getMyPdfPlanning(this));
      if (!res) return;
      commit('SET_PLANNING_DATA', res.data);
    },
    async fetchAllPdfPlannings({ commit }, volunteers: User[]) {
      const maxRequests = 5;
      const planningsRes = [];
      for (let i = 0; i < volunteers.length; i += maxRequests) {
        const chunk = volunteers.slice(i, i + maxRequests);
        const plannings = await Promise.all(
          chunk.map(async ({ id, firstname, lastname }) => {
            const res = await safeCall(this, userRepo.getPdfPlanning(this, id));
            if (!res) return undefined;
            const volunteer = { firstname, lastname, id };
            const planningBase64Data = `${res.data}`;
            return { volunteer, planningBase64Data };
          })
        );
        planningsRes.push(...plannings);
      }
      const retrievedPlannings = planningsRes.filter(
        (res): res is VolunteerPlanning => res !== undefined
      );
      commit('SET_VOLUNTEER_PLANNINGS', retrievedPlannings);
    },
  }
);
