import { VolunteerWithAssignmentDuration } from "@overbookd/assignment";
import { actionTree, mutationTree } from "typed-vuex";
import { VolunteerToTaskRepository } from "~/repositories/assignment/volunteer-to-task.repository";
import { safeCall } from "~/utils/api/calls";

type State = {
  volunteers: VolunteerWithAssignmentDuration[];
};

export const state = (): State => ({
  volunteers: [],
});

export const mutations = mutationTree(state, {
  SET_VOLUNTEERS(state, volunteers: VolunteerWithAssignmentDuration[]) {
    state.volunteers = volunteers;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchVolunteers({ commit }) {
      const res = await safeCall(
        this,
        VolunteerToTaskRepository.getVolunteers(this),
      );
      if (!res) return;
      commit("SET_VOLUNTEERS", res.data);
    },
  },
);
