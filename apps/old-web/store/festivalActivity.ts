import {
  CreateFestivalActivityForm,
  FestivalActivity,
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
  LinkSignageCatalogItem,
  AssignDrive,
} from "@overbookd/festival-event";
import {
  PrepareInChargeForm,
  PrepareSignaForm,
  ReviewRejection,
  InitInquiryRequest,
  PreviewForSecurity,
  PreviewForCommunication,
  PublishFeedbackForm,
} from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/period";
import { actionTree, mutationTree } from "typed-vuex";
import { FestivalActivityRepository } from "~/repositories/festival-activity.repository";
import { safeCall } from "~/utils/api/calls";
import {
  castActivityWithDate,
  castPreviewForCommunicationWithDate,
  castPreviewForSecurityWithDate,
} from "~/utils/festival-event/festival-activity/festival-activity.utils";
import { AddInquiryRequestForm } from "@overbookd/http";

const repo = FestivalActivityRepository;

type State = {
  activities: {
    forAll: PreviewFestivalActivity[];
    forSecurity: PreviewForSecurity[];
    forCommunication: PreviewForCommunication[];
    forLogistic: { csv: string };
  };
  selectedActivity: FestivalActivity;
};

const fakeActivity = defaultDraft(0, "");

export const state = (): State => ({
  activities: {
    forAll: [],
    forSecurity: [],
    forCommunication: [],
    forLogistic: { csv: "" },
  },
  selectedActivity: fakeActivity,
});

export const mutations = mutationTree(state, {
  SET_ALL_ACTIVITIES(state, activities: PreviewFestivalActivity[]) {
    state.activities.forAll = activities;
  },
  SET_PREVIEW_FOR_SECURITY(state, previews: PreviewForSecurity[]) {
    state.activities.forSecurity = previews;
  },
  SET_PREVIEW_FOR_COMMUNICATION(state, previews: PreviewForCommunication[]) {
    state.activities.forCommunication = previews;
  },
  SET_SELECTED_ACTIVITY(state, activity: FestivalActivity) {
    state.selectedActivity = activity;
  },
  SET_CSV_PREVIEW_FOR_LOGISTIC(state, previews: string) {
    state.activities.forLogistic.csv = previews;
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

    async fetchSecurityPreviews({ commit }) {
      const res = await safeCall(this, repo.getSecurityPreviews(this));

      if (!res) return;

      const previews = res.data.map(castPreviewForSecurityWithDate);
      commit("SET_PREVIEW_FOR_SECURITY", previews);
    },

    async fetchCommunicationPreviews({ commit }) {
      const res = await safeCall(this, repo.getCommunicationPreviews(this));

      if (!res) return;

      const previews = res.data.map(castPreviewForCommunicationWithDate);
      commit("SET_PREVIEW_FOR_COMMUNICATION", previews);
    },

    async fetchLogisticPreviews({ commit }) {
      const res = await safeCall(this, repo.getCSVLogisticPreviews(this));

      if (!res) return;

      commit("SET_CSV_PREVIEW_FOR_LOGISTIC", res.data);
    },

    async fetchActivity({ commit }, id: number) {
      const res = await safeCall(this, repo.getOne(this, id));
      if (!res?.data) return;

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

    async linkSignageCatalogItem(
      { state, commit },
      { signageId, catalogItem }: LinkSignageCatalogItem,
    ) {
      const faId = state.selectedActivity.id;
      const form = { catalogItemId: catalogItem.id };
      const res = await safeCall(
        this,
        repo.linkSignageCatalogItem(this, faId, signageId, form),
      );
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

    async addInquiryRequest({ state, commit }, request: AddInquiryRequestForm) {
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

    async clearInquiry({ state, commit }) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.clearInquiry(this, id));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async linkDrive({ state, commit }, link: AssignDrive) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.linkDrive(this, id, link));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    /* PUBLISH FEEDBACK */
    async publishFeedback({ state, commit }, feedback: PublishFeedbackForm) {
      const id = state.selectedActivity.id;
      const res = await safeCall(
        this,
        repo.publishFeedback(this, id, feedback),
      );
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async approveAs({ state, commit }, reviewer: Reviewer<"FA">) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.approve(this, id, reviewer), {
        successMessage: `✅ FA approuvée par l'équipe ${reviewer}`,
      });
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async rejectBecause({ state, commit }, rejection: ReviewRejection<"FA">) {
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
