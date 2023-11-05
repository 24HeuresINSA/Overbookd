import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repo-factory";
import { safeCall } from "~/utils/api/calls";
import { CreateLocation } from "~/utils/models/signa-location.model";
import { SignaLocation } from "@overbookd/signa";

const repo = RepoFactory.SignaLocationRepository;

export const state = () => ({
  locations: [] as SignaLocation[],
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
        },
      );
      if (!signaLocations) return;
      commit("SET_SIGNA_LOCATIONS", signaLocations.data);
    },
    async createLocation({ dispatch }, location: CreateLocation) {
      const res = await safeCall(
        this,
        repo.createNewSignaLocation(this, location),
        {
          successMessage: "Lieu ajouté 🥳",
          errorMessage: "Lieu non ajouté 😢",
        },
      );
      if (!res) return;
      await dispatch("getAllSignaLocations");
    },
    async editLocation({ dispatch }, location: SignaLocation) {
      const res = await safeCall(
        this,
        repo.updateSignaLocation(this, location),
        {
          successMessage: "Lieu modifié 🥳",
          errorMessage: "Lieu non modifié 😢",
        },
      );
      if (!res) return;
      await dispatch("getAllSignaLocations");
    },
    async deleteLocation({ dispatch }, location: SignaLocation) {
      const res = await safeCall(
        this,
        repo.deleteSignaLocation(this, location.id),
        {
          successMessage: "Lieu supprimé 🥳",
          errorMessage: "Lieu non supprimé 😢",
        },
      );
      if (!res) return;
      await dispatch("getAllSignaLocations");
    },
  },
);
