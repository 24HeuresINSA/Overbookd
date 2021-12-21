import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { FT } from "~/utils/models/FT";
import { safeCall } from "~/utils/api/calls";
import { RepoFactory } from "~/repositories/repoFactory";

const repo = RepoFactory.ftRepo;

export const state = () => ({
  mFT: {
    status: "draft",
    count: 0,
    equipments: [] as any,
    timeframes: [] as any,
    validated: [] as any,
    refused: [] as any,
    comments: [] as any,
  } as FT,
});

export const getters = getterTree(state, {
  timeframes: (state) => state.mFT.timeframes,
});

export const mutations = mutationTree(state, {
  SET_FT: function (state, mFT) {
    state.mFT = mFT;
  },
  ASSIGN_FT: function ({ mFT }, data) {
    const key = Object.keys(data)[0] as keyof FT;
    if (!mFT[key]) {
      mFT[key] = data[key] as never;
    } else {
      Object.assign(mFT[key], data[key]);
    }
  },
  ADD_TIMEFRAME_FT: function ({ mFT }, timeframe) {
    if (mFT.timeframes === undefined) {
      mFT.timeframes = [];
    }
    mFT.timeframes.push(timeframe);
  },
  SET_TIMEFRAME_FT: function (state, timeframes) {
    state.mFT.timeframes = timeframes;
  },
  UPDATE_TIMEFRAME: function ({ mFT }, { index, timeframe }) {
    mFT.timeframes[index] = timeframe;
  },
  UPDATE_STATUS: function ({ mFT }, status) {
    mFT.status = status;
  },
  VALIDATE: function ({ mFT }, validator) {
    if (mFT.validated === undefined) {
      mFT.validated = [];
    }
    if (!mFT.validated.find((v) => v == validator)) {
      // avoid duplicate
      mFT.validated.push(validator);

      // remove from refuse
      if (mFT.refused) {
        mFT.refused = mFT.refused.filter((v) => v !== validator);
      }
    }
  },
  REFUSE: function ({ mFT }, validator) {
    if (mFT.refused === undefined) {
      mFT.refused = [];
    }
    if (!mFT.refused.find((v) => v == validator)) {
      // avoid duplicate
      mFT.refused.push(validator);

      // remove from refuse
      if (mFT.validated) {
        mFT.validated = mFT.validated.filter((v) => v !== validator);
      }
    }
  },
  ADD_COMMENT: function ({ mFT }, comment) {
    if (mFT.comments === undefined) {
      mFT.comments = [];
    }
    mFT.comments.unshift(comment);
  },
});

export const actions = actionTree(
  { state },
  {
    getAndSetFT: async function ({ commit }, count: number) {
      // get FT
      const res = await safeCall(this, repo.getFT(this, count.toString()));
      if (res) {
        commit("SET_FT", res.data);
        return res.data;
      }
    },
    saveFT: async function ({ state }) {
      return safeCall(this, repo.updateFT(this, state.mFT), "saved", "server");
    },
    assignFT: function ({ commit }, payload) {
      commit("ASSIGN_FT", payload);
    },
    addTimeframe: function ({ commit, state }, timeframe) {
      // @ts-ignore
      const tf = state.mFT.timeframes.find((t) => t.name === timeframe.name);
      console.log(tf);
      if (tf === undefined) {
        commit("ADD_TIMEFRAME_FT", timeframe);
      }
    },
    addTimeframes: function ({ commit, dispatch }, timeframes) {
      timeframes.forEach((t: any) => dispatch("addTimeframe", t));
    },
    setTimeframes: function ({ commit }, timeframes) {
      commit("SET_TIMEFRAME_FT", timeframes);
    },
    updateTimeframe: function ({ commit }, payload) {
      commit("UPDATE_TIMEFRAME", payload);
    },
    submitForReview: async function ({ dispatch, commit }) {
      commit("UPDATE_STATUS", "submitted");
      await dispatch("saveFT");
    },
    validate: async function ({ dispatch, commit, state }, validator) {
      const FT_VALIDATORS =
        // @ts-ignore
        this.$accessor.config.getConfig("ft_validators").length;
      commit("VALIDATE", validator);
      await dispatch("addComment", {
        topic: "validated",
        time: new Date(),
        validator,
      });
      if (state.mFT.validated.length === FT_VALIDATORS) {
        // validated by all validators
        commit("UPDATE_STATUS", "validated");
      }
      await dispatch("saveFT");
    },
    refuse: async function (
      { dispatch, commit, state },
      { validator, comment }
    ) {
      commit("REFUSE", validator);
      await dispatch("addComment", {
        topic: "refused",
        text: comment,
        time: new Date(),
        validator,
      });
      commit("UPDATE_STATUS", "refused");
      await dispatch("saveFT");
    },
    addComment: async function ({ dispatch, commit, state }, comment) {
      commit("ADD_COMMENT", comment);
    },
    readyForAssignment: async function ({ dispatch, commit }, by: string) {
      await dispatch("addComment", {
        topic: "ready",
        text: "FT prêt a validation",
        time: new Date(),
        validator: by,
      });
      commit("UPDATE_STATUS", "ready");
      await dispatch("saveFT");
    },
  }
);
