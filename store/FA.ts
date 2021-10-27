import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { FA } from "~/utils/models/FA";
import { FT } from "~/utils/models/FT";
import { safeCall } from "~/utils/api/calls";
import { RepoFactory } from "~/repositories/repoFactory";

export const state = () => ({
  mFA: {
    status: "draft",
    equipments: [] as any,
    timeframes: [] as any,
    validated: [] as any,
    refused: [] as any,
    FTs: [] as FT[],
  } as FA,
});

export const getters = getterTree(state, {
  getEquipments: function (state) {
    return state.mFA.equipments;
  },
});

export const mutations = mutationTree(state, {
  ASSIGN_FA: function ({ mFA }, data) {
    const key = Object.keys(data)[0] as keyof FA;
    if (!mFA[key]) {
      // @ts-ignore
      mFA[key] = data[key];
    } else {
      Object.assign(mFA[key], data[key]);
    }
  },
  SET_FA: function (state, mFA) {
    state.mFA = mFA;
  },
  RESET_FA: function (state) {
    state.mFA = {
      status: "draft",
      equipments: [],
      timeframes: [],
      validated: [],
      refused: [],
      comments: [],
      FTs: [],
    };
  },
  ADD_TIMEFRAME: function (state, timeframe) {
    state.mFA.timeframes.push(timeframe);
  },
  ADD_EQUIPMENT: function (state, equipment) {
    state.mFA.equipments.push(equipment);
  },
  DELETE_TIMEFRAME: function (state, index) {
    state.mFA.timeframes.splice(index, 1);
  },
  UPDATE_REQUIRED_EQUIPMENT: function (state, { _id, count }) {
    const equipment = state.mFA.equipments.find((e: any) => e._id === _id);
    if (equipment) {
      equipment.required = count;
    }
  },
  DELETE_EQUIPMENT: function (state, _id) {
    // @ts-ignore
    state.mFA.equipments = state.mFA.equipments.filter(
      (e: any) => e._id !== _id
    );
  },
  VALIDATE_FA: function (state, validator) {
    if (state.mFA.validated === undefined) {
      // init if not existing
      state.mFA.validated = [];
    }
    if (!state.mFA.validated.find((v) => v === validator)) {
      // avoid duplicates
      state.mFA.validated.push(validator);
      if (state.mFA.refused) {
        // remove validated validator from refused
        state.mFA.refused = state.mFA.refused.filter((v) => v !== validator);
      }
      const FA_VALIDATORS =
        // @ts-ignore
        this.$accessor.config.getConfig("fa_validators").length;
      if (state.mFA.validated.length === FA_VALIDATORS) {
        state.mFA.status = "validated";
      }

      // add comment
      if (!state.mFA.comments) {
        state.mFA.comments = [];
      }
      state.mFA.comments.push({
        time: new Date(),
        text: `valide par ${validator}`,
        validator,
        topic: "valide",
      });
    }
  },
  REFUSE_FA: function (state, { validator, comment }) {
    state.mFA.status = "refused";
    if (!state.mFA.refused) {
      state.mFA.refused = [];
    }
    state.mFA.refused.push(validator);
    if (!state.mFA.comments) {
      state.mFA.comments = [];
    }

    // remove from validated
    if (state.mFA.validated) {
      state.mFA.validated = state.mFA.validated.filter((v) => v !== validator);
    }

    // ad comment
    state.mFA.comments.push({
      time: new Date(),
      text: comment,
      topic: "refuse",
      validator,
    });
  },
  SET_STATUS_FA: function (state, { by, status }) {
    state.mFA.status = status;
    if (!state.mFA.comments) {
      state.mFA.comments = [];
    }
    state.mFA.comments.push({
      time: new Date(),
      text: `changement de status a ${status} par ${by}`,
      validator: "",
      topic: status,
    });
  },
  ADD_FT: function (state, FT: FT) {
    if (state.mFA.FTs === undefined) {
      state.mFA.FTs = [];
    }
    state.mFA.FTs.push(FT);
  },
});

export const actions = actionTree(
  { state },
  {
    assignFA: function ({ commit }, payload) {
      commit("ASSIGN_FA", payload);
    },
    addTimeframeToFA: function ({ commit }, payload) {
      commit("ADD_TIMEFRAME", payload);
    },
    addEquipmentToFA: function ({ commit, state }, payload) {
      if (!state.mFA.equipments.find((e: any) => payload._id === e._id)) {
        payload.required = 1;
        commit("ADD_EQUIPMENT", payload);
      }
    },
    deleteTimeframe: function ({ commit }, payload) {
      commit("DELETE_TIMEFRAME", payload);
    },
    updateEquipmentRequiredCount: function ({ commit }, payload) {
      commit("UPDATE_REQUIRED_EQUIPMENT", payload);
    },
    deleteEquipment: function ({ commit }, payload) {
      commit("DELETE_EQUIPMENT", payload);
    },
    setFA: function ({ commit }, payload) {
      commit("SET_FA", payload);
    },
    validate: function ({ commit }, payload) {
      commit("VALIDATE_FA", payload);
    },
    setStatus: function ({ commit }, payload) {
      commit("SET_STATUS_FA", payload);
    },
    refuse: function ({ commit }, payload) {
      commit("REFUSE_FA", payload);
    },
    resetFA: function ({ commit }, payload) {
      commit("RESET_FA", payload);
    },
    addNewFT: async function ({ commit }, name) {
      const repo = RepoFactory;
      const FT = {
        FA: state().mFA.count,
        general: {
          name: name,
        },
        status: "draft",
        validated: [] as String[],
        refused: [] as String[],
        equipments: [] as any[],
        timeframes: [] as any[],
      } as FT;
      const resFT = await safeCall(this, repo.ftRepo.createFT(this, FT));
      if (resFT) {
        // @ts-ignore
        const resFA = await safeCall(
          this,
          repo.faRepo.updateFA(this, this.$accessor.FA.mFA)
        );
        if (resFA) {
          commit("ADD_FT", FT);
        }
      }
    },
  }
);
