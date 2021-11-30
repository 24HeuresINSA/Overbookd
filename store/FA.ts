import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { FA, SecurityPass, Signalisation } from "~/utils/models/FA";
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
    securityPasses: [] as SecurityPass[],
    signalisation: [] as Signalisation[],
  } as FA,
});

export const getters = getterTree(state, {
  getEquipments: function (state) {
    return state.mFA.equipments;
  },
  timeframes: function (state) {
    return state.mFA.timeframes;
  },
});

export const mutations = mutationTree(state, {
  ASSIGN_FA: function ({ mFA }, data) {
    const key = Object.keys(data)[0] as keyof FA;
    if (!mFA[key]) {
      // @ts-ignore
      mFA[key] = data[key];
    } else {
      // @ts-ignore
      if (mFA[key].length !== undefined) {
        // array
      }
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
      isValid: true,
      securityPasses: [],
      signalisation: [],
    };
  },
  ADD_TIMEFRAME: function (state, timeframe) {
    if (
      state.mFA.timeframes.find((e) => e.name === timeframe.name) === undefined
    ) {
      state.mFA.timeframes.push(timeframe);
    }
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
  ADD_COMMENT: function (state, comment) {
    if (!state.mFA.comments) {
      state.mFA.comments = [];
    }
    state.mFA.comments.push(comment);
  },
  UNDELETE: function (state) {
    state.mFA.isValid = true;
  },
  ADD_SECURITY_PASS: function (state, securityPass) {
    if (state.mFA.securityPasses === undefined) {
      state.mFA.securityPasses = [];
    }
    state.mFA.securityPasses.push(securityPass);
  },
  DELETE_SECURITY_PASS: function (state, index) {
    state.mFA.securityPasses.splice(index, 1);
  },
  ADD_SIGNALISATION: function (state, signalisation) {
    state.mFA.signalisation.push(signalisation);
  },
  DELETE_SIGNALISATION: function (state, index) {
    state.mFA.signalisation.splice(index, 1);
  },
  UPDATE_SIGNALISATION_NUMBER: function (state, { index, number }) {
    state.mFA.signalisation[index].number = number;
  },
});

export const actions = actionTree(
  { state },
  {
    updateSignalisationNumber(context, signalisationNumber) {
      context.commit("UPDATE_SIGNALISATION_NUMBER", signalisationNumber);
    },
    deleteSignalisation: ({ commit }, index) => {
      commit("DELETE_SIGNALISATION", index);
    },
    addSignalisation: async ({ commit }, signalisation) => {
      commit("ADD_SIGNALISATION", signalisation);
    },
    addSecurityPass: async function ({ commit }, securityPass) {
      commit("ADD_SECURITY_PASS", securityPass);
    },
    deleteSecurityPass: async function ({ commit }, index) {
      commit("DELETE_SECURITY_PASS", index);
    },
    assignFA: function ({ commit }, payload) {
      commit("ASSIGN_FA", payload);
    },
    addTimeframe: function ({ commit }, payload) {
      commit("ADD_TIMEFRAME", payload);
    },
    addTimeframes: function ({ commit }, payload) {
      payload.forEach((t: any) => {
        commit("ADD_TIMEFRAME", t);
      });
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
    undelete: function ({ commit }) {
      commit("UNDELETE");
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
    addComment: function ({ commit }, payload) {
      commit("ADD_COMMENT", payload);
    },
    addNewFT: async function ({ commit, state, dispatch }, name) {
      const repo = RepoFactory;
      const FT = {
        FA: state.mFA.count,
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
        const resFA = await safeCall(
          this,
          // @ts-ignore
          repo.faRepo.updateFA(this, this.$accessor.FA.mFA)
        );
        if (resFA) {
          commit("ADD_FT", resFT.data);
          await safeCall(this, repo.faRepo.updateFA(this, state.mFA));
        }
      }
    },
  }
);
