import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { SignaLocation } from "~/utils/models/signaLocation";
import { sendNotification } from "./catalog";

const repo = RepoFactory.signaLocationRepo;

export const state = () => ({
  signaLocations: [] as SignaLocation[],
  signaLocation: {} as SignaLocation,
});

export const getters = getterTree(state, {
  getLocationById: (state) => (id: number) => {
    return state.signaLocations.find((location) => location.id === id);
  },
});

export const mutations = mutationTree(state, {
  SET_SIGNA_LOCATIONS(state, signaLocations: SignaLocation[]) {
    state.signaLocations = signaLocations;
  },
  SET_SIGNA_LOCATION(state, signaLocation: SignaLocation) {
    state.signaLocation = signaLocation;
  },
});

export const actions = actionTree(
  { state },
  {
    async getAllSignaLocations({ commit }) {
      const signaLocations = await repo.getAllSignaLocations(this);
      if (signaLocations && signaLocations.data) {
        commit("SET_SIGNA_LOCATIONS", signaLocations.data);
      }
      sendNotification(
        this,
        "Erreur lors de la récupération des lieux signa",
        "error"
      );
    },
  }
);
