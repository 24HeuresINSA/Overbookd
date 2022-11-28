import { actionTree, getterTree, mutationTree } from "typed-vuex";
import {
  collaborator,
  CommentType,
  FA,
  fa_collaborator,
  fa_comment,
  fa_electricity_needs,
  fa_signa_needs,
  Status,
  time_window,
} from "~/utils/models/FA";
import { safeCall } from "~/utils/api/calls";
import { RepoFactory } from "~/repositories/repoFactory";

const repo = RepoFactory.faRepo;

export const state = () => ({
  mFA: {
    status: Status.DRAFT,
    name: "",
  } as FA,
  FAs: [] as FA[],
  validated_by: [] as string[],
  refused_by: [] as string[],
});

export const getters = getterTree(state, {
  getFA: (state) => state.mFA,
  getFAs: (state) => state.FAs,
  getValidatedBy: (state) => state.validated_by,
  getRefusedBy: (state) => state.refused_by,
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

  SET_ALL_FA(state, allFA: FA[]) {
    state.FAs = allFA.filter((fa) => fa.is_deleted === false);
  },

  UPDATE_STATUS({ mFA }, status: Status) {
    mFA.status = status;
  },

  UPDATE_FA({ mFA }, { key, value }) {
    if (typeof mFA[key as keyof FA] !== "undefined") {
      mFA[key as keyof FA] = value as never;
    }
  },

  VALIDATE({ validated_by, refused_by }, validator: string) {
    if (validated_by === undefined) {
      validated_by = [] as string[];
    }
    // avoid duplicate
    if (validated_by.find((v) => v == validator)) {
      validated_by.push(validator);

      // remove from refuse
      if (refused_by) {
        refused_by = refused_by.filter((v) => v !== validator);
      }
    }
  },

  REFUSE({ refused_by, validated_by }, validator: string) {
    if (refused_by === undefined) {
      refused_by = [] as string[];
    }
    // avoid duplicate
    if (refused_by.find((v) => v == validator)) {
      refused_by.push(validator);

      // remove from refuse
      if (validated_by) {
        validated_by = validated_by.filter((v) => v !== validator);
      }
    }
  },

  ADD_COMMENT({ mFA }, comment: fa_comment) {
    if (!mFA.fa_comments) mFA.fa_comments = [];
    mFA.fa_comments?.push(comment);
  },

  ADD_SIGNA_NEED({ mFA }, signaNeed: fa_signa_needs) {
    if (!mFA.fa_signa_needs) mFA.fa_signa_needs = [];
    mFA.fa_signa_needs?.push(signaNeed);
  },

  UPDATE_SIGNA_NEED_COUNT({ mFA }, { index, count }) {
    if (mFA.fa_signa_needs && mFA.fa_signa_needs[index]) {
      mFA.fa_signa_needs[index].count = count;
    }
  },

  DELETE_SIGNA_NEED({ mFA }, index: number) {
    if (mFA.fa_signa_needs && mFA.fa_signa_needs[index]) {
      mFA.fa_signa_needs.splice(index, 1);
    }
  },

  ADD_TIME_WINDOW({ mFA }, timeWindow: time_window) {
    if (!mFA.time_windows) mFA.time_windows = [];
    mFA.time_windows?.push(timeWindow);
  },

  UPDATE_TIME_WINDOW({ mFA }, { index, timeWindow }) {
    if (mFA.time_windows && mFA.time_windows[index]) {
      mFA.time_windows[index].start = timeWindow.start;
      mFA.time_windows[index].end = timeWindow.end;
    }
  },

  DELETE_TIME_WINDOW({ mFA }, index: number) {
    if (mFA.time_windows && mFA.time_windows[index]) {
      mFA.time_windows.splice(index, 1);
    }
  },

  ADD_COLLABORATOR({ mFA }, collaborator: fa_collaborator) {
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
      const res = await safeCall(this, repo.getFAByCount(this, id));
      if (res && res.data) {
        commit("SET_FA", res.data);
        return res.data;
      }
      return null;
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
      const comment: fa_comment = {
        fa_id: faId,
        subject: CommentType.SUBMIT,
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

    validate: async function ({ dispatch, commit, state }, validator: string) {
      commit("VALIDATE", validator);
      // @ts-ignore
      const MAX_VALIDATORS = this.$accessor.team.faValidators;
      if (state.validated_by.length === MAX_VALIDATORS) {
        // validated by all validators
        commit("UPDATE_STATUS", Status.VALIDATED);
      }
      await dispatch("saveFA");
    },

    refuse: async function ({ dispatch, commit }, validator: string) {
      commit("REFUSE", validator);
      commit("UPDATE_STATUS", Status.REFUSED);
      await dispatch("saveFA");
    },

    addComment({ commit }, comment: fa_comment) {
      commit("ADD_COMMENT", comment);
    },

    addSignaNeed({ commit }, signaNeed: fa_signa_needs) {
      commit("ADD_SIGNA_NEED", signaNeed);
    },

    updateSignaNeedCount({ commit }, { index, count }) {
      commit("UPDATE_SIGNA_NEED_COUNT", { index, count });
    },

    deleteSignaNeed({ commit }, index: number) {
      commit("DELETE_SIGNA_NEED", index);
    },

    addTimeWindow({ commit }, timeWindow: time_window) {
      commit("ADD_TIME_WINDOW", timeWindow);
    },

    updateTimeWindow({ commit }, { index, timeWindow }) {
      commit("UPDATE_TIME_WINDOW", { index, timeWindow });
    },

    deleteTimeWindow({ commit }, index: number) {
      commit("DELETE_TIME_WINDOW", index);
    },

    addCollaborator({ commit }, collaborator: fa_collaborator) {
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

    deleteElectricityNeed({ commit }, index: number) {
      commit("DELETE_ELECTRICITY_NEED", index);
    },
  }
);
