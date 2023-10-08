import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repo-factory";
import { safeCall } from "~/utils/api/calls";
import {
  Location,
  SignaLocation,
  CreateLocation,
} from "~/utils/models/signa-location.model";

const repo = RepoFactory.SignaLocationRepository;

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
        },
      );
      if (!signaLocations) return;
      const formattedLocations = signaLocations.data.map(
        (location) => new Location(location.id, location.name),
      );
      commit("SET_SIGNA_LOCATIONS", formattedLocations);
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
