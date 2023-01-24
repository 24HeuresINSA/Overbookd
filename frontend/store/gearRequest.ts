import { mutationTree, actionTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { EventGearRequest } from "~/utils/models/gearRequests";

const gearRequestRepository = RepoFactory.GearRequestRepository;

interface State {
  gearRequests: EventGearRequest[];
}

export const state = (): State => ({
  gearRequests: [],
});

export const mutations = mutationTree(state, {
  SET_GEAR_REQUESTS(state, gearRequest: EventGearRequest[]) {
    state.gearRequests = gearRequest;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchGearRequests({ commit }): Promise<void> {
      const res = await safeCall(
        this,
        gearRequestRepository.getGearRequests(this),
        {
          successMessage: "Demandes de matos chargees ✅",
          errorMessage: "Impossible de charger les demandes de matos ❌",
        }
      );
      if (!res) return;
      commit("SET_GEAR_REQUESTS", res.data);
    },
  }
);
