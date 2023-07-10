import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { SignaLocation } from "~/utils/models/signaLocation";

const repo = RepoFactory.signaLocationRepo;

export const state = () => ({
  locations: [] as SignaLocation[],
  location: {} as SignaLocation,
});

export const getters = getterTree(state, {
  getLocationById: (state) => (id: number) => {
    return state.locations.find((location) => location.id === id);
  },
});

export const mutations = mutationTree(state, {
  SET_SIGNA_LOCATIONS(state, signaLocations: SignaLocation[]) {
    state.locations = signaLocations;
  },
  SET_SIGNA_LOCATION(state, signaLocation: SignaLocation) {
    state.location = signaLocation;
  },
});

export const actions = actionTree(
  { state },
  {
    async getAllSignaLocations({ commit }) {
      const signaLocations = await safeCall(
        this,
        repo.getAllSignaLocations(this),
        {
          errorMessage: "Erreur lors de la récupération des lieux de la signa.",
        }
      );
      if (!signaLocations) return;
      commit("SET_SIGNA_LOCATIONS", signaLocations.data);
    },
  }
);
