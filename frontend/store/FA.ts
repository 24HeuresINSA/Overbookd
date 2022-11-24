import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { FA, Status } from "~/utils/models/FA";
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
  //////////////// id de by ?
  UPDATE_STATUS: function ({ mFA }, status: Status, by?: string) {
    mFA.status = status;
  },
  UPDATE_FA: function ({ mFA }, fa: FA) {
    mFA = fa;
  },
  UPDATE_NAME: function ({ mFA }, name: string) {
    mFA.name = name;
  },
  ////////////////////  Validated_by plutôt dans mFA ?
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

    submitForReview: async function ({ commit }, by) {
      commit("UPDATE_STATUS", Status.SUBMITTED, by);
    },

    updateFA: async function ({ commit }, fa) {
      //// Plein de modifs
      commit("UPDATE_FA", fa);
    },

    updateName: async function ({ dispatch, commit }, name) {
      commit("UPDATE_NAME", name);
      await dispatch("saveFA");
    },

    validate: async function ({ dispatch, commit, state }, validator: string) {
      commit("VALIDATE", validator);
      const MAX_VALIDATORS =
        // @ts-ignore
        this.$accessor.config.getConfig("ft_validators").length;
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
  }
);
