import { actionTree, mutationTree, getterTree } from "typed-vuex";
import { safeCall } from "~/utils/api/calls";
import { RepoFactory } from "~/repositories/repoFactory";
import { User } from "~/utils/models/repo";
import { FT } from "~/utils/models/FT";
import { FA } from "~/utils/models/FA";

declare interface filter{
    user: {
        search: string;
        team: string;
    };
    FT: {
        search: string;
    };
    isModeOrgaToTache: boolean;
}

export const state = () => ({
    users: [] as User[],
    filters: {} as filter,
    selectedUser: {} as User,
    FTs: [] as FT[],
    FAs: [] as FA[],
});

export const mutations = mutationTree(state, {
    SET_USERS(state: any, data: User[]) {
        state.users = data;
    },
    SET_SELECTED_USER(state: any, data: User) {
        state.selectedUser = data;
    },
    SET_FTs(state: any, data: any) {
        state.FTs = data;
    },
    SET_FAs(state: any, data: any) {
        state.FA = data;
    },
});

export const actions = actionTree({ state }, {
    /**
     * 
     * get all users
     * @returns 
     */
    async getUsers({ commit }: any) {
        const ret = await safeCall(
            this, 
            RepoFactory.userRepo.getAllUsers(this)
        );
        if(ret) {
            commit("SET_USERS", ret.data);
        }
        return ret;

    },
    /**
     * get all FTs
     * 
     * @returns 
     */
    async getFTs({ commit }: any) {
        const ret = await safeCall(
            this, 
            RepoFactory.ftRepo.getAllFTs(this)
        );
        if(ret) {
            commit("SET_FTs", ret.data);
        }
        return ret;
    },
    /**
     * get all FAs
     * 
     * @returns 
     */
    async getFAs({ commit }: any) {
        const ret = await safeCall(
            this, 
            RepoFactory.faRepo.getAllFAs(this)
        );
        if(ret) {
            commit("SET_FAs", ret.data);
        }
        return ret;
    },
});

export const getters = getterTree(state, {
});
