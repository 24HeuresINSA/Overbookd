import { mutationTree, actionTree, getterTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { Timeslot } from "~/utils/models/repo";
import { safeCall } from "~/utils/api/calls";
import { updateItemToList } from "~/utils/functions/list";

const timeslotRepo = RepoFactory.timeslotRepo;

export const state = () => ({
  timeslots: [] as Timeslot[],
  createStatus: "",
});

export const mutations = mutationTree(state, {
  SET_TIMESLOTS(state, timeslots: Timeslot[]) {
    state.timeslots = timeslots;
  },

  ADD_TIMESLOT(state, timeslot: Timeslot) {
    state.timeslots.push(timeslot);
  },

  ADD_TIMESLOTS(state, timeslots: Timeslot[]) {
    state.timeslots.push(...timeslots);
  },

  SET_CREATE_STATUS(state, status: string) {
    state.createStatus = status;
  },
  REPLACE_TIMESLOT(state, obj: { timeslot: Timeslot; id: string }) {
    const index = state.timeslots.findIndex((t) => t._id === obj.id);
    if (index !== -1) {
      state.timeslots = updateItemToList(state.timeslots, index, obj.timeslot);
    }
  },
  DELETE_TIMESLOT(state, id: string) {
    const index = state.timeslots.findIndex((t) => t._id === id);
    if (index !== -1) {
      state.timeslots.splice(index, 1);
    }
  },
  DELETE_BY_GROUP_TITLE(state, groupTitle: string) {
    state.timeslots = state.timeslots.filter(
      (t) => t.groupTitle !== groupTitle
    );
  },
});

export const getters = getterTree(state, {
  getTimeslotsByGroupTitle(state) {
    return (groupTitle: string) => {
      return state.timeslots.filter((timeslot) => {
        return timeslot.groupTitle === groupTitle;
      });
    };
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
    async addTimeslot(context, timeslot: Timeslot) {
      const newTimeslotRes = await safeCall(
        this,
        timeslotRepo.create(this, timeslot)
      );
      if (newTimeslotRes && newTimeslotRes.data) {
        context.commit("ADD_TIMESLOT", newTimeslotRes.data);
      }
    },
    async addTimeslots(context, timeslots: Timeslot[]) {
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
    async deleteByGroupTitle(context, groupTitle: string) {
      const res = await safeCall(
        this,
        timeslotRepo.deleteByGroupTitle(this, groupTitle)
      );
      if (res && res.data) {
        context.commit("DELETE_BY_GROUP_TITLE", groupTitle);
        context.commit("SET_CREATE_STATUS", "Créneau supprimé");
        return res;
      } else {
        context.commit(
          "SET_CREATE_STATUS",
          "Il y a eu un problème lors de la suppression des créneaux"
        );
        return null;
      }
    },
  }
);
