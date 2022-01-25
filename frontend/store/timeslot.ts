import { mutationTree, actionTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { timeslot } from "~/utils/models/repo";
import { safeCall } from "~/utils/api/calls";

const timeslotRepo = RepoFactory.timeslotRepo;

export const state = () => ({
  timeslots: [] as timeslot[],
  createStatus: "",
});

export const mutations = mutationTree(state, {
  SET_TIMESLOTS(state, timeslots: timeslot[]) {
    state.timeslots = timeslots;
  },

  ADD_TIMESLOT(state, timeslot: timeslot) {
    state.timeslots.push(timeslot);
  },

  ADD_TIMESLOTS(state, timeslots: timeslot[]) {
    state.timeslots.push(...timeslots);
  },

  SET_CREATE_STATUS(state, status: string) {
    state.createStatus = status;
  },
  REPLACE_TIMESLOT(state, obj: { timeslot: timeslot; id: string }) {
    const index = state.timeslots.findIndex((t) => t._id === obj.id);
    if (index !== -1) {
      state.timeslots[index] = obj.timeslot;
      //Component that watch this timeslots wont reload if we dont do the next line :D
      state.timeslots = [...state.timeslots];
    }
  },
  DELETE_TIMESLOT(state, id: string) {
    const index = state.timeslots.findIndex((t) => t._id === id);
    if (index !== -1) {
      state.timeslots.splice(index, 1);
    }
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchTimeslots(context) {
      const res = await safeCall(this, timeslotRepo.getAll(this));
      if (res && res.data) {
        context.commit("SET_TIMESLOTS", res.data);
      }
    },
    async addTimeslot(context, timeslot: timeslot) {
      const newTimeslotRes = await safeCall(
        this,
        timeslotRepo.create(this, timeslot)
      );
      if (newTimeslotRes && newTimeslotRes.data) {
        context.commit("ADD_TIMESLOT", newTimeslotRes.data);
      }
    },
    async addTimeslots(context, timeslots: timeslot[]) {
      const res = await safeCall(
        this,
        timeslotRepo.createMany(this, timeslots)
      );
      if (res && res.data) {
        context.commit("ADD_TIMESLOTS", res.data);
        context.commit("SET_CREATE_STATUS", "Done !");
      } else {
        context.commit(
          "SET_CREATE_STATUS",
          "Un ou plusieurs créneaux existent déjà 😒"
        );
      }
    },
    async setCreateStatus(context, status: string) {
      context.commit("SET_CREATE_STATUS", status);
    },
    async updateTimeslot(context, timeslot: { id: string; charisma: number }) {
      const res = await safeCall(
        this,
        timeslotRepo.update(this, timeslot.id, timeslot.charisma)
      );
      if (res && res.data) {
        context.commit("REPLACE_TIMESLOT", {
          timeslot: res.data,
          id: timeslot.id,
        });
      }
    },
    async deleteTimeslot(context, id: string) {
      const res = await safeCall(this, timeslotRepo.delete(this, id));
      if (res && res.data) {
        context.commit("DELETE_TIMESLOT", id);
        context.commit("SET_CREATE_STATUS", "Créneau supprimé");
      } else {
        context.commit(
          "SET_CREATE_STATUS",
          "Impossible de supprimer le créneau, une personne ou plus a déjà choisi ce créneau"
        );
      }
    },
  }
);
