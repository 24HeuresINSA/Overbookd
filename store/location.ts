import { mutationTree, actionTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { location } from "~/utils/models/repo";
import { safeCall } from "~/utils/api/calls";

const locationRepo = RepoFactory.locationRepo;

export const state = () => ({
  locations: [] as location[],
});

export const mutations = mutationTree(state, {
  SET_LOCATIONS(state, locations: location[]) {
    state.locations = locations;
  },
  SET_LOCATION(state, location: location) {
    const id = state.locations.findIndex((l) => l.name === location.name);
    if (id !== -1) {
      state.locations[id] = location;
      state.locations = [...state.locations];
    } else {
      state.locations.push(location);
    }
  },
  DELETE_LOCATION(state, location: location) {
    state.locations = state.locations.filter((l) => l._id !== location._id);
  },
  UPDATE_LOCATION(state, location: location) {
    const index = state.locations.findIndex((l) => l._id === location._id);
    state.locations[index] = location;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async getAllLocations(context) {
      const res = await safeCall(this, locationRepo.getAllLocations(this));
      if (res && res.data) {
        context.commit("SET_LOCATIONS", res.data);
      }
    },
    async deleteLocation(context, id: string) {
      const res = await safeCall(this, locationRepo.deleteLocation(this, id));
      if (res) {
        context.commit("DELETE_LOCATION", res.data);
      }
    },
    async createNewLocation(context, location: location) {
      const res = await safeCall(
        this,
        locationRepo.updateLocation(this, location)
      );
      if (res && res.data) {
        context.commit("SET_LOCATION", res.data);
      }
    },
    async updateLocation(context, location: location) {
      const res = await safeCall(
        this,
        locationRepo.updateLocation(this, location)
      );
      if (res && res.data) {
        context.commit("UPDATE_LOCATION", res.data);
      }
    },
    async createManyLocations(context, locations: location[]) {
      const res = await safeCall(
        this,
        locationRepo.createManyLocations(this, locations)
      );
      if (res && res.data) {
        context.commit("SET_LOCATIONS", res.data);
      }
    },
  }
);
