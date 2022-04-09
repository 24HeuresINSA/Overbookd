import {actionTree, getterTree, mutationTree} from "typed-vuex";
import {FT} from "~/utils/models/FT";
import {safeCall} from "~/utils/api/calls";
import {RepoFactory} from "~/repositories/repoFactory";
import {FTStatus} from "~/utils/FT";
import FtRepo from "~/repositories/ftRepo";

const repo = RepoFactory.ftRepo;

export const state = () => ({
    mFT: {
        status: FTStatus.draft,
        count: 0,
        equipments: [] as any,
        timeframes: [] as any,
        validated: [] as any,
        refused: [] as any,
        comments: [] as any,
    } as FT,
    Fts: [] as FT[],
});

export type FTState = ReturnType<typeof state>;

export const getters = getterTree(state, {
    timeframes: (state) => state.mFT.timeframes,
    equipmentMap: function (state): Map<String, number> {
        const equipmentMap = new Map<string, number>();
        state.Fts.forEach((ft) => {
            if (ft.equipments) {
                ft.equipments.forEach((equipment) => {
                    if (equipmentMap.has(equipment._id)) {
                        equipmentMap.set(
                            equipment._id,
                            equipmentMap.get(equipment._id)! + equipment.required
                        );
                    } else {
                        equipmentMap.set(equipment._id, equipment.required);
                    }
                });
            }
        });
        return equipmentMap;
    },
});

/* ############################################ */
/*                   mutations                  */
/* ############################################ */

export const mutations = mutationTree(state, {
    SET_ALL_FTS: function (state, Fts: FT[]) {
        state.Fts = Fts;
    },
    SET_FT: function (state, mFT) {
        state.mFT = mFT;
    },
    ASSIGN_FT: function ({mFT}, data) {
        const key = Object.keys(data)[0] as keyof FT;
        if (!mFT[key]) {
            mFT[key] = data[key] as never;
        } else {
            Object.assign(mFT[key], data[key]);
        }
    },
    ADD_TIMEFRAME_FT: function ({mFT}, timeframe) {
        if (mFT.timeframes === undefined) {
            mFT.timeframes = [];
        }
        mFT.timeframes.push(timeframe);
    },
    SET_TIMEFRAME_FT: function (state, timeframes) {
        state.mFT.timeframes = timeframes;
    },
    UPDATE_TIMEFRAME: function ({mFT}, {index, timeframe}) {
        mFT.timeframes.splice(index, 1, timeframe);
    },
    UPDATE_STATUS: function ({mFT}, status) {
        mFT.status = status;
    },
    VALIDATE: function ({mFT}, validator) {
        if (mFT.validated === undefined) {
            mFT.validated = [];
        }
        if (!mFT.validated.find((v) => v == validator)) {
            // avoid duplicate
            mFT.validated.push(validator);

            // remove from refuse
            // todo check for reactivity
            if (mFT.refused) {
                mFT.refused = mFT.refused.filter((v) => v !== validator);
            }
        }
    },
    REFUSE: function ({mFT}, validator) {
        if (mFT.refused === undefined) {
            mFT.refused = [];
        }
        if (!mFT.refused.find((v) => v == validator)) {
            // avoid duplicate
            mFT.refused.push(validator);

            // remove from refuse
            // todo check for reactivity
            if (mFT.validated) {
                mFT.validated = mFT.validated.filter((v) => v !== validator);
            }
        }
    },
    ADD_EQUIPMENT: function (state, equipment) {
        state.mFT.equipments.push(equipment);
    },
    ADD_COMMENT: function ({mFT}, comment) {
        if (mFT.comments === undefined) {
            mFT.comments = [];
        }
        mFT.comments.unshift(comment);
    },
    DELETE_TIMEFRAME_FT: function ({mFT}, index) {
        mFT.timeframes.splice(index, 1);
    },
    SET_PARENT_FA: function ({mFT}, faCount) {
        mFT.FA = faCount;
    },
    ADD_REQUIREMENT: function ({mFT}, {requirement, timeframeIndex}) {
        const mTimeframe = mFT.timeframes[timeframeIndex];
        if (mTimeframe.required === undefined) {
            mTimeframe.required = [];
        }
        mTimeframe.required.push({...requirement});
        mFT.timeframes.splice(timeframeIndex, 1, mTimeframe); // update rendering
    },
    DELETE_REQUIREMENT: function ({mFT}, {requirementIndex, timeframeIndex}) {
        const mTimeframe = mFT.timeframes[timeframeIndex];
        if (mTimeframe.required) {
            mTimeframe.required.splice(requirementIndex, 1);
            mFT.timeframes.splice(timeframeIndex, 1, mTimeframe); // update rendering
        }
    },
    DELETE_EQUIPMENT: function ({mFT}, index) {
        mFT.equipments.splice(index, 1);
    },
    DELETE_EQUIPMENT_BY_ID: function ({mFT}, equipmentId) {
        mFT.equipments = mFT.equipments.filter((e) => e._id !== equipmentId);
    },
    UPDATE_EQUIPMENT_REQUIRED_COUNT: function ({mFT}, {_id, count}) {
        const equipment = mFT.equipments.find((e: any) => e._id === _id);
        if (equipment) {
            equipment.required = count;
        }
    },
    MARK_READY_FOR_ASSIGNMENT: function ({mFT}) {
        mFT.status = "ready";
        mFT.refused = [];
        mFT.validated = ["humain", "log"]; // change with config later
    },
});

/* ############################################ */
/*                    actions                   */
/* ############################################ */

export const actions = actionTree(
    {state},
    {
        getAndSetFT: async function ({commit}, count: number) {
            // get FT
            const res = await safeCall(this, repo.getFT(this, count.toString()));
            if (res && res.data) {
                commit("SET_FT", res.data);
                return res.data;
            }
            return null;
        },
        fetchAll: async function ({commit}) {
            const res = await safeCall(this, repo.getAllFTs(this));
            if (res) {
                commit("SET_ALL_FTS", res.data.data);
                return res.data;
            }
            return null;
        },
        saveFT: async function ({state}) {
            return safeCall(this, repo.updateFT(this, state.mFT), "saved", "server");
        },
        unlinkFA: async function ({commit}) {
            commit("SET_PARENT_FA", 0);
        },
        assignFT: function ({commit}, payload) {
            commit("ASSIGN_FT", payload);
        },
        addTimeframe: function ({commit, state}, timeframe) {
            // @ts-ignore
            const tf = state.mFT.timeframes.find((t) => t.name === timeframe.name);
            if (tf === undefined) {
                commit("ADD_TIMEFRAME_FT", timeframe);
            }
        },
        addTimeframes: function ({commit, dispatch}, timeframes) {
            timeframes.forEach((t: any) => dispatch("addTimeframe", t));
        },
        setTimeframes: function ({commit}, timeframes) {
            commit("SET_TIMEFRAME_FT", timeframes);
        },
        addEquipment: function ({commit, state}, equipment) {
            if (!state.mFT.equipments.find((e: any) => equipment._id === e._id)) {
                equipment.required = 1;
                commit("ADD_EQUIPMENT", equipment);
            }
        },
        deleteTimeframe: function ({commit, state}, index) {
            commit("DELETE_TIMEFRAME_FT", index);
        },
        updateTimeframe: function ({commit}, payload) {
            commit("UPDATE_TIMEFRAME", payload);
        },
        submitForReview: async function ({dispatch, commit}) {
            commit("UPDATE_STATUS", FTStatus.submitted);
            await dispatch("saveFT");
        },
        /**
         * Validate the FT from one validator
         * @param validator validator name
         */
        validate: async function ({dispatch, commit, state}, validator) {
            const FT_VALIDATORS =
                // @ts-ignore
                this.$accessor.config.getConfig("ft_validators").length;
            commit("VALIDATE", validator);
            await dispatch("addComment", {
                topic: "validated",
                time: new Date(),
                // @ts-ignore
                validator: validator + " - " + this.$accessor.user.me.firstname + " " + this.$accessor.user.me.lastname,
            });
            if (state.mFT.validated.length === FT_VALIDATORS) {
                // validated by all validators
                commit("UPDATE_STATUS", FTStatus.validated);
            }
            await dispatch("saveFT");
        },
        /**
         * Refuse the FT from one of the validators
         * @param payload validator name and comment from him
         */
        refuse: async function (
            {dispatch, commit, state},
            {validator, comment}
        ) {
            commit("REFUSE", validator);
            await dispatch("addComment", {
                topic: "refused",
                text: comment,
                time: new Date(),
                // @ts-ignore
                validator: validator + " - " + this.$accessor.user.me.firstname + " " + this.$accessor.user.me.lastname,
            });
            commit("UPDATE_STATUS", FTStatus.refused);
            await dispatch("saveFT");
        },
        /**
         * Add a comment to the FT
         * @param comment Infos to push in history
         */
        addComment: async function ({dispatch, commit, state}, comment) {
            commit("ADD_COMMENT", comment);
        },
        /**
         * Mark FT as ready for assignment
         * @param by validator name
         */
        readyForAssignment: async function (
            {dispatch, commit, state},
            by: string
        ) {
            const res = await safeCall(
                this,
                FtRepo.markAsReady(this, state.mFT.count)
            );
            if (res) {
                await dispatch("addComment", {
                    topic: "ready",
                    text: "FT prête à affectation",
                    time: new Date(),
                    validator: by,
                });
                commit("MARK_READY_FOR_ASSIGNMENT", by);
                await dispatch("saveFT");
            }
        },
        setParentFA: async function ({dispatch, commit}, faCount) {
            commit("SET_PARENT_FA", faCount);
            dispatch("saveFT");
        },
        addRequirement: async function ({dispatch, commit}, payload) {
            commit("ADD_REQUIREMENT", payload);
        },
        deleteRequirement: async function ({dispatch, commit}, payload) {
            commit("DELETE_REQUIREMENT", payload);
        },
        deleteEquipment: async function ({dispatch, commit}, payload) {
            commit("DELETE_EQUIPMENT", payload);
        },
        deleteEquipmentById: async function ({dispatch, commit}, payload) {
            commit("DELETE_EQUIPMENT_BY_ID", payload);
        },
        updateEquipmentRequiredCount: async function (
            {dispatch, commit},
            payload
        ) {
            commit("UPDATE_EQUIPMENT_REQUIRED_COUNT", payload);
        },
    }
);
