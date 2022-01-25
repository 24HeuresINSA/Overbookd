import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { location } from "~/utils/models/repo";
import { safeCall } from "~/utils/api/calls";

const locationRepo = RepoFactory.locationRepo;

// The state types definitions
interface State {
  locations: location[];
}

export const state = (): State => ({
  locations: [],
});

export const getters = getterTree(state, {
  signa(state): location[] {
    return state.locations.filter((e) => {
      return e.neededBy.includes("SIGNA");
    });
  },
  inventaire: (state) => {
    return state.locations.filter((e) => {
      return e.neededBy.length == 1 && e.neededBy[0] == "INVENTAIRE";
    });
  },
});

export const mutations = mutationTree(state, {
  SET_LOCATIONS(state, locations: location[]) {
    state.locations = locations;
    // console.log("locations in state :", state.locations);
  },
  SET_LOCATION(state, location: location) {
    state.locations.push(location);
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
    async getAllLocations(context): Promise<any> {
      const res = await safeCall(this, locationRepo.getAllLocations(this));
      if (res && res.data) {
        context.commit("SET_LOCATIONS", res.data);
      }
      return res;
    },
    async deleteLocation(context, id: string) {
      const res = await safeCall(this, locationRepo.deleteLocation(this, id));
      if (res) {
        context.commit("DELETE_LOCATION", res.data);
      }
    },
    async createNewLocation(
      context,
      location: Omit<location, "_id">
    ): Promise<any> {
      const res = await safeCall(
        this,
        locationRepo.createNewLocation(this, location)
      );
      if (res && res.data) {
        context.commit("SET_LOCATION", res.data);
      }
      return res;
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
