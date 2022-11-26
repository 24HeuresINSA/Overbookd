import { actionTree, getterTree, mutationTree } from "typed-vuex";
import {
  CommentType,
  FA,
  fa_comment,
  fa_signa_needs,
  Status,
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
  SET_FA: function (state, fa: Partial<FA>) {
    state.mFA = { ...state.mFA, ...fa };
  },

  RESET_FA: function (state) {
    state.mFA = {
      status: Status.DRAFT,
      name: "",
    } as FA;
  },

  SET_ALL_FA: function (state, allFA: FA[]) {
    state.FAs = allFA.filter((fa) => fa.is_deleted === false);
  },

  UPDATE_STATUS: function ({ mFA }, status: Status) {
    mFA.status = status;
  },

  UPDATE_FA: function ({ mFA }, data) {
    if (data && data.key && typeof mFA[data.key as keyof FA] !== "undefined") {
      mFA[data.key as keyof FA] = data.value as never;
      console.log(mFA);
    }
  },

  VALIDATE: function ({ validated_by, refused_by }, validator: string) {
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

  REFUSE: function ({ refused_by, validated_by }, validator: string) {
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

  ADD_COMMENT: function ({ mFA }, comment: fa_comment) {
    if (!mFA.fa_comment) mFA.fa_comment = [];
    mFA.fa_comment?.push(comment);
  },

  ADD_SIGNA_NEEDS: function ({ mFA }, signaNeeds: fa_signa_needs) {
    if (!mFA.fa_signa_needs) mFA.fa_signa_needs = [];
    mFA.fa_signa_needs?.push(signaNeeds);
  },

  UPDATE_SIGNA_NEEDS_COUNT: function ({ mFA }, { index, count }) {
    if (mFA.fa_signa_needs && mFA.fa_signa_needs[index]) {
      mFA.fa_signa_needs[index].count = count;
    }
  },

  DELETE_SIGNA_NEEDS: function ({ mFA }, index) {
    if (mFA.fa_signa_needs && mFA.fa_signa_needs[index]) {
      mFA.fa_signa_needs.splice(index, 1);
    }
  },
});

export const actions = actionTree(
  { state },
  {
    setFA: function ({ commit }, FA: FA) {
      commit("SET_FA", FA);
    },

    resetFA: function ({ commit }, payload) {
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
      const res = await safeCall(this, repo.getAllFAs(this));
      if (res && res.data) {
        commit("SET_ALL_FA", res.data);
        return res;
      }
      return null;
    },

    submitForReview: async function ({ commit }, author: any) {
      // Un peu overkill de passer this.me en params
      const comment: fa_comment = {
        fa_id: 1,
        subject: CommentType.SUBMIT,
        comment: `La FA a été soumise par ${author.firstname} ${author.lastname}.`,
        author: author.id,
        created_at: new Date(),
      };
      commit("ADD_COMMENT", comment);
      commit("UPDATE_STATUS", Status.SUBMITTED);
    },

    updateFA: async function ({ commit }, payload) {
      commit("UPDATE_FA", payload);
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

    addComment: async function ({ commit }, comment: fa_comment) {
      commit("ADD_COMMENT", comment);
    },

    addSignaNeeds: async function ({ commit }, signaNeeds: fa_signa_needs) {
      commit("ADD_SIGNA_NEEDS", signaNeeds);
    },

    updateSignaNeedsCount({ commit }, { index, count }) {
      commit("UPDATE_SIGNA_NEEDS_COUNT", { index, count });
    },
    deleteSignaNeeds: ({ commit }, index: number) => {
      commit("DELETE_SIGNA_NEEDS", index);
    },
  }
);
