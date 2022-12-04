import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import {
  collaborator,
  FA,
  fa_collaborators,
  fa_comments,
  fa_electricity_needs,
  fa_signa_needs,
  fa_validation_body,
  GearRequest,
  GearRequestCreation,
  Status,
  subject_type,
  time_windows,
} from "~/utils/models/FA";

const repo = RepoFactory.faRepo;

export const state = () => ({
  mFA: {
    status: Status.DRAFT,
    name: "",
  } as FA,
  gearRequests: [] as GearRequest[],
});

export const getters = getterTree(state, {
  matosGearRequests(state) {
    return state.gearRequests.filter((gr) => gr.gear.owner?.code === "matos");
  },
  elecGearRequests(state) {
    return state.gearRequests.filter((gr) => gr.gear.owner?.code === "elec");
  },
  barrieresGearRequests(state) {
    return state.gearRequests.filter(
      (gr) => gr.gear.owner?.code === "barrieres"
    );
  },
});

export const mutations = mutationTree(state, {
  SET_FA(state, fa: Partial<FA>) {
    state.mFA = { ...state.mFA, ...fa };
  },

  RESET_FA(state) {
    state.mFA = {
      status: Status.DRAFT,
      name: "",
    } as FA;
  },

  UPDATE_STATUS({ mFA }, status: Status) {
    mFA.status = status;
  },

  UPDATE_FA({ mFA }, { key, value }) {
    if (typeof mFA[key as keyof FA] !== "undefined") {
      mFA[key as keyof FA] = value as never;
    }
  },

  ADD_COMMENT({ mFA }, comment: fa_comments) {
    if (!mFA.fa_comments) mFA.fa_comments = [];
    mFA.fa_comments?.push(comment);
  },

  ADD_SIGNA_NEED({ mFA }, signaNeed: fa_signa_needs) {
    if (!mFA.fa_signa_needs) mFA.fa_signa_needs = [];
    mFA.fa_signa_needs?.push(signaNeed);
  },

  UPDATE_SIGNA_NEED_COUNT({ mFA }, { index, count }) {
    if (mFA.fa_signa_needs && mFA.fa_signa_needs[index]) {
      mFA.fa_signa_needs[index].count = Number(count);
    }
  },

  DELETE_SIGNA_NEED({ mFA }, index: number) {
    if (mFA.fa_signa_needs && mFA.fa_signa_needs[index]) {
      mFA.fa_signa_needs.splice(index, 1);
    }
  },

  ADD_TIME_WINDOW({ mFA }, timeWindow: time_windows) {
    if (!mFA.time_windows) mFA.time_windows = [];
    mFA.time_windows?.push(timeWindow);
  },

  UPDATE_TIME_WINDOW({ mFA }, { index, timeWindow }) {
    if (mFA.time_windows && mFA.time_windows[index]) {
      mFA.time_windows[index].start = timeWindow.start;
      mFA.time_windows[index].end = timeWindow.end;
      mFA.time_windows[index].type = timeWindow.type;
    }
  },

  DELETE_TIME_WINDOW({ mFA }, index: number) {
    if (mFA.time_windows && mFA.time_windows[index]) {
      mFA.time_windows.splice(index, 1);
    }
  },

  ADD_COLLABORATOR({ mFA }, collaborator: fa_collaborators) {
    if (!mFA.fa_collaborators) mFA.fa_collaborators = [];
    mFA.fa_collaborators?.push(collaborator);
  },

  UPDATE_COLLABORATOR({ mFA }, { index, key, value }) {
    if (!mFA.fa_collaborators || !mFA.fa_collaborators[index]) return;
    mFA.fa_collaborators[index].collaborator[key as keyof collaborator] =
      value as never;
  },

  DELETE_COLLABORATOR({ mFA }, index: number) {
    if (mFA.fa_collaborators && mFA.fa_collaborators[index]) {
      mFA.fa_collaborators.splice(index, 1);
    }
  },

  ADD_ELECTRICITY_NEED({ mFA }, elecNeed: fa_electricity_needs) {
    if (!mFA.fa_electricity_needs) mFA.fa_electricity_needs = [];
    mFA.fa_electricity_needs?.push(elecNeed);
  },

  DELETE_ELECTRICITY_NEED({ mFA }, index: number) {
    if (mFA.fa_electricity_needs && mFA.fa_electricity_needs[index]) {
      mFA.fa_electricity_needs.splice(index, 1);
    }
  },
  ADD_GEAR_REQUEST({ gearRequests }, gearRequest: GearRequest) {
    gearRequests.push(gearRequest);
  },
  SET_GEAR_REQUESTS({ gearRequests }, gearRequestsResponse: GearRequest[]) {
    gearRequests = gearRequestsResponse;
  },
});

export const actions = actionTree(
  { state },
  {
    setFA({ commit }, FA: FA) {
      commit("SET_FA", FA);
    },

    resetFA({ commit }, payload) {
      commit("RESET_FA", payload);
    },

    getAndSet: async function ({ commit }, id: number) {
      const [resFA, resGearRequests] = await Promise.all([
        safeCall(this, repo.getFAByCount(this, id)),
        safeCall(this, repo.getGearRequests(this, id)),
      ]);
      if (!resGearRequests || !resFA) return null;
      commit("SET_GEAR_REQUESTS", resGearRequests.data);
      commit("SET_FA", resFA.data);
      return resFA.data;
    },

    fetchAll: async function ({ commit }) {
      const res: any = await safeCall(this, repo.getAllFAs(this));
      if (res && res.data) {
        commit("SET_ALL_FA", res.data);
        return res;
      }
      return null;
    },

    submitForReview: async function (
      { commit },
      { faId, authorId, authorName }
    ) {
      if (!faId || !authorId || !authorName) return;
      const comment: fa_comments = {
        subject: subject_type.SUBMIT,
        comment: `La FA a été soumise par ${authorName}.`,
        author: authorId,
        created_at: new Date(),
      };
      commit("ADD_COMMENT", comment);
      commit("UPDATE_STATUS", Status.SUBMITTED);
    },

    updateFA({ commit }, { key, value }) {
      commit("UPDATE_FA", { key, value });
    },

    save: async function ({ dispatch, state }) {
      const allPromise = [];
      allPromise.push(
        RepoFactory.faRepo.updateFA(this, state.mFA.id, state.mFA)
      );
      if (state.mFA.fa_collaborators) {
        allPromise.push(
          RepoFactory.faRepo.updateFACollaborators(
            this,
            state.mFA.id,
            state.mFA.fa_collaborators
          )
        );
      }
      if (state.mFA.fa_signa_needs) {
        allPromise.push(
          RepoFactory.faRepo.updateFASignaNeeds(
            this,
            state.mFA.id,
            state.mFA.fa_signa_needs
          )
        );
      }
      if (state.mFA.time_windows) {
        allPromise.push(
          RepoFactory.faRepo.updateFATimeWindows(
            this,
            state.mFA.id,
            state.mFA.time_windows
          )
        );
      }
      if (state.mFA.fa_electricity_needs) {
        allPromise.push(
          RepoFactory.faRepo.updateFAElectricityNeeds(
            this,
            state.mFA.id,
            state.mFA.fa_electricity_needs
          )
        );
      }
      if (state.mFA.fa_comments) {
        allPromise.push(
          RepoFactory.faRepo.updateFAComments(
            this,
            state.mFA.id,
            state.mFA.fa_comments
          )
        );
      }
      await Promise.all(allPromise);
      dispatch("getAndSet", state.mFA.id);
    },

    validate: async function (
      { dispatch, commit, state },
      { validator_id, user_id, team_name }
    ) {
      //check if the team is already in the list
      if (state.mFA.fa_validation?.find((v) => v.Team.id === validator_id))
        return;
      if (state.mFA.fa_refuse?.length === 1) {
        if (state.mFA.fa_refuse[0].Team.id === validator_id) {
          commit("UPDATE_STATUS", Status.SUBMITTED);
        }
      }
      // @ts-ignore
      const MAX_VALIDATORS = this.$accessor.team.faValidators.length;
      // -1 car la validation est faite avant l'ajout du validateur
      if (state.mFA.fa_validation?.length === MAX_VALIDATORS - 1) {
        // validated by all validators
        commit("UPDATE_STATUS", Status.VALIDATED);
      }
      const body: fa_validation_body = {
        team_id: validator_id,
      };
      await RepoFactory.faRepo.validateFA(this, state.mFA.id, body);
      const comment: fa_comments = {
        subject: subject_type.VALIDATED,
        comment: `La FA a été validée par ${team_name}.`,
        author: user_id,
        created_at: new Date(),
      };
      commit("ADD_COMMENT", comment);
      dispatch("save");
    },

    refuse: async function (
      { dispatch, commit, state },
      { validator_id, user_id, message }
    ) {
      if (state.mFA.fa_refuse?.find((v) => v.Team.id === validator_id)) return;
      commit("UPDATE_STATUS", Status.REFUSED);
      const body: fa_validation_body = {
        team_id: validator_id,
      };
      await RepoFactory.faRepo.refuseFA(this, state.mFA.id, body);
      const comment: fa_comments = {
        subject: subject_type.REFUSED,
        comment: `La FA a été refusée : ${message}.`,
        author: user_id,
        created_at: new Date(),
      };
      commit("ADD_COMMENT", comment);
      dispatch("save");
    },

    async addComment({ commit, state }, comment: fa_comments) {
      commit("ADD_COMMENT", comment);
      if (state.mFA.fa_comments) {
        await RepoFactory.faRepo.updateFAComments(
          this,
          state.mFA.id,
          state.mFA.fa_comments
        );
      }
    },

    addSignaNeed({ commit }, signaNeed: fa_signa_needs) {
      commit("ADD_SIGNA_NEED", signaNeed);
    },

    updateSignaNeedCount({ commit }, { index, count }) {
      commit("UPDATE_SIGNA_NEED_COUNT", { index, count });
    },

    async deleteSignaNeed({ commit, state }, index: number) {
      if (state.mFA.fa_signa_needs && state.mFA.fa_signa_needs[index]) {
        const id = state.mFA.fa_signa_needs[index].id;
        if (id) {
          await RepoFactory.faRepo.deleteFASignaNeeds(this, id);
        }
      }
      commit("DELETE_SIGNA_NEED", index);
    },

    addTimeWindow({ commit }, timeWindow: time_windows) {
      commit("ADD_TIME_WINDOW", timeWindow);
    },

    updateTimeWindow({ commit }, { index, timeWindow }) {
      commit("UPDATE_TIME_WINDOW", { index, timeWindow });
    },

    async deleteTimeWindow({ commit, state }, index: number) {
      if (state.mFA.time_windows && state.mFA.time_windows[index]) {
        const id = state.mFA.time_windows[index].id;
        if (id) {
          await RepoFactory.faRepo.deleteFATimeWindows(this, id);
        }
      }
      commit("DELETE_TIME_WINDOW", index);
    },

    addCollaborator({ commit }, collaborator: fa_collaborators) {
      commit("ADD_COLLABORATOR", collaborator);
    },

    updateCollaborator({ commit }, { index, key, value }) {
      commit("UPDATE_COLLABORATOR", { index, key, value });
    },

    deleteCollaborator({ commit }, index: number) {
      commit("DELETE_COLLABORATOR", index);
    },

    addElectricityNeed({ commit }, elecNeed: fa_electricity_needs) {
      commit("ADD_ELECTRICITY_NEED", elecNeed);
    },

    async deleteElectricityNeed({ commit, state }, index: number) {
      if (
        state.mFA.fa_electricity_needs &&
        state.mFA.fa_electricity_needs[index]
      ) {
        const id = state.mFA.fa_electricity_needs[index].id;
        if (id) {
          await RepoFactory.faRepo.deleteFAElectricityNeeds(this, id);
        }
      }
      commit("DELETE_ELECTRICITY_NEED", index);
    },
    async addGearRequest({ commit, state }, gearRequest: GearRequestCreation) {
      const res = await RepoFactory.faRepo.createGearRequest(
        this,
        state.mFA.id,
        gearRequest
      );
      commit("ADD_GEAR_REQUEST", res.data);
    },
  }
);
