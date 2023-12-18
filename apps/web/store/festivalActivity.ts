import {
  CreateFestivalActivityForm,
  FestivalActivity,
  PrepareFeedbackPublish,
  PrepareGeneralUpdate,
  PrepareSignageCreation,
  PrepareSignageUpdate,
  PrepareElectricitySupplyCreation,
  PrepareElectricitySupplyUpdate,
  PrepareSecurityUpdate,
  PrepareSupplyUpdate,
  PrepareContractorCreation,
  PrepareContractorUpdate,
  Contractor,
  ElectricitySupply,
  PreviewFestivalActivity,
  Signage,
  TimeWindow,
  defaultDraft,
  InquiryRequest,
  Reviewer,
} from "@overbookd/festival-activity";
import {
  PrepareInChargeForm,
  PrepareSignaForm,
  ReviewRejection,
  InitInquiryRequest,
} from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/period";
import { actionTree, mutationTree } from "typed-vuex";
import { FestivalActivityRepository } from "~/repositories/festival-activity.repository";
import { safeCall } from "~/utils/api/calls";
import { castActivityWithDate } from "~/utils/festival-event/festival-activity.utils";
import { AddInquiryRequest } from "@overbookd/http";
import { LinkDrive } from "~/utils/festival-event/festival-activity.model";

const repo = FestivalActivityRepository;

type State = {
  allActivities: PreviewFestivalActivity[];
  selectedActivity: FestivalActivity;
};

const fakeActivity = defaultDraft(0, "Fake activity");

export const state = (): State => ({
  allActivities: [],
  selectedActivity: fakeActivity,
});

export const mutations = mutationTree(state, {
  SET_ALL_ACTIVITIES(state, activities: PreviewFestivalActivity[]) {
    state.allActivities = activities;
  },
  SET_SELECTED_ACTIVITY(state, activity: FestivalActivity) {
    state.selectedActivity = activity;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    /* FETCH */
    async fetchAllActivities({ commit }) {
      const res = await safeCall(this, repo.getAll(this));
      if (!res) return;
      commit("SET_ALL_ACTIVITIES", res.data);
    },

    async fetchActivity({ commit }, id: number) {
      const res = await safeCall(this, repo.getOne(this, id));

      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    /* CREATE */
    async create({ commit, dispatch }, form: CreateFestivalActivityForm) {
      const res = await safeCall(this, repo.create(this, form));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
      await dispatch("fetchAllActivities");
    },

    /* ASK FOR REVIEW */
    async askForReview({ state, commit, dispatch }) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.askForReview(this, id));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
      await dispatch("fetchAllActivities");
    },

    /* REMOVE */
    async remove({ commit, dispatch }, id: FestivalActivity["id"]) {
      const res = await safeCall(this, repo.remove(this, id), {
        successMessage: `FA #${id} supprimée 🗑️`,
      });
      if (!res) return;

      commit("SET_SELECTED_ACTIVITY", fakeActivity);
      await dispatch("fetchAllActivities");
    },

    /* UPDATE GENERAL */
    async updateGeneral({ state, commit }, general: PrepareGeneralUpdate) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.updateGeneral(this, id, general));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async addGeneralTimeWindow({ state, commit }, timeWindow: IProvidePeriod) {
      const id = state.selectedActivity.id;
      const res = await safeCall(
        this,
        repo.addGeneralTimeWindow(this, id, timeWindow),
      );
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async removeGeneralTimeWindow(
      { state, commit },
      timeWindowId: TimeWindow["id"],
    ) {
      const id = state.selectedActivity.id;
      const res = await safeCall(
        this,
        repo.removeGeneralTimeWindow(this, id, timeWindowId),
      );
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    /* UPDATE IN CHARGE */
    async updateInCharge({ state, commit }, inCharge: PrepareInChargeForm) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.updateInCharge(this, id, inCharge));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async addContractor(
      { state, commit },
      contractor: PrepareContractorCreation,
    ) {
      const id = state.selectedActivity.id;
      const res = await safeCall(
        this,
        repo.addContractor(this, id, contractor),
      );
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async updateContractor(
      { state, commit },
      contractor: PrepareContractorUpdate,
    ) {
      const id = state.selectedActivity.id;
      const res = await safeCall(
        this,
        repo.updateContractor(this, id, contractor),
      );
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async removeContractor({ state, commit }, contractorId: Contractor["id"]) {
      const id = state.selectedActivity.id;
      const res = await safeCall(
        this,
        repo.removeContractor(this, id, contractorId),
      );
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    /* UPDATE SIGNA */
    async updateSigna({ state, commit }, signa: PrepareSignaForm) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.updateSigna(this, id, signa));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async addSignage({ state, commit }, signage: PrepareSignageCreation) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.addSignage(this, id, signage));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async updateSignage({ state, commit }, signage: PrepareSignageUpdate) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.updateSignage(this, id, signage));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async removeSignage({ state, commit }, signageId: Signage["id"]) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.removeSignage(this, id, signageId));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    /* UPDATE SECURITY */
    async updateSecurity({ state, commit }, security: PrepareSecurityUpdate) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.updateSecurity(this, id, security));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    /* UPDATE SUPPLY */
    async updateSupply({ state, commit }, supply: PrepareSupplyUpdate) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.updateSupply(this, id, supply));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async addElectricitySupply(
      { state, commit },
      supply: PrepareElectricitySupplyCreation,
    ) {
      const id = state.selectedActivity.id;
      const res = await safeCall(
        this,
        repo.addElectricitySupply(this, id, supply),
      );
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async updateElectricitySupply(
      { state, commit },
      supply: PrepareElectricitySupplyUpdate,
    ) {
      const id = state.selectedActivity.id;
      const res = await safeCall(
        this,
        repo.updateElectricitySupply(this, id, supply),
      );
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async removeElectricitySupply(
      { state, commit },
      supplyId: ElectricitySupply["id"],
    ) {
      const id = state.selectedActivity.id;
      const res = await safeCall(
        this,
        repo.removeElectricitySupply(this, id, supplyId),
      );
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    /* UPDATE INQUIRY */
    async addInquiryTimeWindow({ state, commit }, timeWindow: IProvidePeriod) {
      const id = state.selectedActivity.id;
      const res = await safeCall(
        this,
        repo.addInquiryTimeWindow(this, id, timeWindow),
      );
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async removeInquiryTimeWindow(
      { state, commit },
      timeWindowId: TimeWindow["id"],
    ) {
      const id = state.selectedActivity.id;
      const res = await safeCall(
        this,
        repo.removeInquiryTimeWindow(this, id, timeWindowId),
      );
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async addInquiryRequest({ state, commit }, request: AddInquiryRequest) {
      const id = state.selectedActivity.id;
      const res = await safeCall(
        this,
        repo.addInquiryRequest(this, id, request),
      );
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async removeInquiryRequest(
      { state, commit },
      slug: InquiryRequest["slug"],
    ) {
      const id = state.selectedActivity.id;
      const res = await safeCall(
        this,
        repo.removeInquiryRequest(this, id, slug),
      );
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async initInquiry({ state, commit }, form: InitInquiryRequest) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.initInquiry(this, id, form));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async linkDrive({ state, commit }, link: LinkDrive) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.linkDrive(this, id, link));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    /* PUBLISH FEEDBACK */
    async publishFeedback({ state, commit }, feedback: PrepareFeedbackPublish) {
      const id = state.selectedActivity.id;
      const res = await safeCall(
        this,
        repo.publishFeedback(this, id, feedback),
      );
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async approveAs({ state, commit }, reviewer: Reviewer) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.approve(this, id, reviewer), {
        successMessage: `✅ FA approuvée par l'équipe ${reviewer}`,
      });
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async rejectBecause({ state, commit }, rejection: ReviewRejection) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.reject(this, id, rejection), {
        successMessage: `🛑 FA rejetée par l'équipe ${rejection.team}`,
      });
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },
  },
);
