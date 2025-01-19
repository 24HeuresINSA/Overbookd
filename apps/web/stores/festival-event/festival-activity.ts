import {
  type CreateFestivalActivityForm,
  type FestivalActivity,
  type PrepareGeneralUpdate,
  type PrepareSignageCreation,
  type PrepareSignageUpdate,
  type PrepareElectricitySupplyCreation,
  type PrepareElectricitySupplyUpdate,
  type PrepareSecurityUpdate,
  type PrepareSupplyUpdate,
  type PrepareContractorCreation,
  type PrepareContractorUpdate,
  type Contractor,
  type ElectricitySupply,
  type PreviewFestivalActivity,
  type Signage,
  type TimeWindow,
  type InquiryRequest,
  type AssignDrive,
  defaultDraft,
  type Draft,
  previewOf,
  type Reviewable,
} from "@overbookd/festival-event";
import type {
  PrepareInChargeForm,
  PrepareSignaForm,
  ReviewRejection,
  InitInquiryRequest,
  PreviewForSecurity,
  PreviewForCommunication,
  PublishFeedbackForm,
  ReviewApproval,
} from "@overbookd/http";
import type { IProvidePeriod } from "@overbookd/time";
import { FestivalActivityRepository } from "~/repositories/festival-event/festival-activity.repository";
import {
  castActivityWithDate,
  castPreviewForCommunicationWithDate,
  castPreviewForSecurityWithDate,
} from "~/utils/festival-event/festival-activity/festival-activity.utils";
import type { AddInquiryRequestForm } from "@overbookd/http";
import { isHttpError } from "~/utils/http/http-error.utils";
import { updateItemToList } from "@overbookd/list";

const repo = FestivalActivityRepository;

type State = {
  activities: {
    forAll: PreviewFestivalActivity[];
    mine: PreviewFestivalActivity[];
    forSecurity: PreviewForSecurity[];
    forCommunication: PreviewForCommunication[];
    forLogistic: { csv: string };
  };
  selectedActivity: FestivalActivity;
};

const fakeActivity = defaultDraft(0, "");

export const useFestivalActivityStore = defineStore("festival-activity", {
  state: (): State => ({
    activities: {
      forAll: [],
      mine: [],
      forSecurity: [],
      forCommunication: [],
      forLogistic: { csv: "" },
    },
    selectedActivity: fakeActivity,
  }),
  actions: {
    /* FETCH */
    async fetchAllActivities() {
      const res = await repo.getAll();
      if (isHttpError(res)) return;
      this.activities.forAll = res;
    },

    async fetchMyActivities() {
      const res = await repo.getMine();
      if (isHttpError(res)) return;
      this.activities.mine = res;
    },

    addActivityToPreviews(activity: Draft) {
      const exists = this.activities.forAll.some(
        ({ id }) => activity.id === id,
      );
      if (exists) return;
      const preview = previewOf(activity);
      this.activities.forAll = [...this.activities.forAll, preview];
    },

    updatePreviousPreview(activity: Reviewable) {
      const preview = previewOf(activity);
      const index = this.activities.forAll.findIndex(
        ({ id }) => id === activity.id,
      );
      this.activities.forAll = updateItemToList(
        this.activities.forAll,
        index,
        preview,
      );
    },

    async fetchSecurityPreviews() {
      const res = await repo.getSecurityPreviews();
      if (isHttpError(res)) return;
      this.activities.forSecurity = res.map(castPreviewForSecurityWithDate);
    },

    async fetchCommunicationPreviews() {
      const res = await repo.getCommunicationPreviews();
      if (isHttpError(res)) return;
      this.activities.forCommunication = res.map(
        castPreviewForCommunicationWithDate,
      );
    },

    async fetchLogisticPreviews() {
      const res = await repo.getCSVLogisticPreviews();
      if (isHttpError(res)) return;
      this.activities.forLogistic.csv = res;
    },

    async fetchActivity(id: number) {
      this.selectedActivity = fakeActivity;
      const res = await repo.getOne(id);
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    /* CREATE */
    async create(form: CreateFestivalActivityForm) {
      this.selectedActivity = fakeActivity;
      const res = await repo.create(form);
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
      await this.fetchAllActivities();
    },

    /* ASK FOR REVIEW */
    async askForReview() {
      const res = await repo.askForReview(this.selectedActivity.id);
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
      await this.fetchAllActivities();
    },

    /* REMOVE */
    async remove(id: FestivalActivity["id"]) {
      const res = await repo.remove(id);
      if (isHttpError(res)) return;
      sendSuccessNotification(`FA #${id} supprimée 🗑️`);
      this.selectedActivity = fakeActivity;
      await this.fetchAllActivities();
    },

    /* UPDATE GENERAL SECTION */
    async updateGeneral(general: PrepareGeneralUpdate) {
      const res = await repo.updateGeneral(this.selectedActivity.id, general);
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async addGeneralTimeWindow(timeWindow: IProvidePeriod) {
      const res = await repo.addGeneralTimeWindow(
        this.selectedActivity.id,
        timeWindow,
      );
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async removeGeneralTimeWindow(timeWindowId: TimeWindow["id"]) {
      const res = await repo.removeGeneralTimeWindow(
        this.selectedActivity.id,
        timeWindowId,
      );
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    /* UPDATE IN CHARGE SECTION */
    async updateInCharge(inCharge: PrepareInChargeForm) {
      const res = await repo.updateInCharge(this.selectedActivity.id, inCharge);
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async addContractor(contractor: PrepareContractorCreation) {
      const res = await repo.addContractor(
        this.selectedActivity.id,
        contractor,
      );
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async updateContractor(contractor: PrepareContractorUpdate) {
      const res = await repo.updateContractor(
        this.selectedActivity.id,
        contractor,
      );
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async removeContractor(contractorId: Contractor["id"]) {
      const res = await repo.removeContractor(
        this.selectedActivity.id,
        contractorId,
      );
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    /* UPDATE SIGNA SECTION */
    async updateSigna(signa: PrepareSignaForm) {
      const res = await repo.updateSigna(this.selectedActivity.id, signa);
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async addSignage(signage: PrepareSignageCreation) {
      const res = await repo.addSignage(this.selectedActivity.id, signage);
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async updateSignage(signage: PrepareSignageUpdate) {
      const res = await repo.updateSignage(this.selectedActivity.id, signage);
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async removeSignage(signageId: Signage["id"]) {
      const res = await repo.removeSignage(this.selectedActivity.id, signageId);
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async linkSignageCatalogItem(
      activitySignageId: string,
      catalogItemId: number,
    ) {
      const res = await repo.linkSignageCatalogItem(
        this.selectedActivity.id,
        activitySignageId,
        { catalogItemId },
      );
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    /* UPDATE SECURITY SECTION */
    async updateSecurity(security: PrepareSecurityUpdate) {
      const res = await repo.updateSecurity(this.selectedActivity.id, security);
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    /* UPDATE SUPPLY SECTION */
    async updateSupply(supply: PrepareSupplyUpdate) {
      const res = await repo.updateSupply(this.selectedActivity.id, supply);
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async addElectricitySupply(supply: PrepareElectricitySupplyCreation) {
      const res = await repo.addElectricitySupply(
        this.selectedActivity.id,
        supply,
      );
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async updateElectricitySupply(supply: PrepareElectricitySupplyUpdate) {
      const res = await repo.updateElectricitySupply(
        this.selectedActivity.id,
        supply,
      );
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async removeElectricitySupply(supplyId: ElectricitySupply["id"]) {
      const res = await repo.removeElectricitySupply(
        this.selectedActivity.id,
        supplyId,
      );
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    /* UPDATE INQUIRY */
    async addInquiryTimeWindow(timeWindow: IProvidePeriod) {
      const res = await repo.addInquiryTimeWindow(
        this.selectedActivity.id,
        timeWindow,
      );
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async updateInquiryTimeWindow(timeWindow: TimeWindow) {
      const res = await repo.updateInquiryTimeWindow(
        this.selectedActivity.id,
        timeWindow["id"],
        timeWindow,
      );
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async removeInquiryTimeWindow(timeWindowId: TimeWindow["id"]) {
      const res = await repo.removeInquiryTimeWindow(
        this.selectedActivity.id,
        timeWindowId,
      );
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async addInquiryRequest(request: AddInquiryRequestForm) {
      const res = await repo.addInquiryRequest(
        this.selectedActivity.id,
        request,
      );
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async updateInquiryRequest(
      slug: InquiryRequest["slug"],
      quantity: InquiryRequest["quantity"],
    ) {
      const res = await repo.updateInquiryRequest(
        this.selectedActivity.id,
        slug,
        { quantity },
      );
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async removeInquiryRequest(slug: InquiryRequest["slug"]) {
      const res = await repo.removeInquiryRequest(
        this.selectedActivity.id,
        slug,
      );
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async initInquiry(form: InitInquiryRequest) {
      const res = await repo.initInquiry(this.selectedActivity.id, form);
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async clearInquiry() {
      const res = await repo.clearInquiry(this.selectedActivity.id);
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async linkDrive(link: AssignDrive) {
      const res = await repo.linkDrive(this.selectedActivity.id, link);
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    /* PUBLISH FEEDBACK */
    async publishFeedback(feedback: PublishFeedbackForm) {
      const res = await repo.publishFeedback(
        this.selectedActivity.id,
        feedback,
      );
      if (isHttpError(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    /* REVIEW */
    async approve(reviewer: ReviewApproval<"FA">) {
      const res = await repo.approve(this.selectedActivity.id, reviewer);
      if (isHttpError(res)) return;
      sendSuccessNotification(`FA approuvée par l'équipe ${reviewer.team}`);
      this.selectedActivity = castActivityWithDate(res);
    },

    async rejectBecause(rejection: ReviewRejection<"FA">) {
      const res = await repo.reject(this.selectedActivity.id, rejection);
      if (isHttpError(res)) return;
      sendSuccessNotification(`FA rejetée par l'équipe ${rejection.team}`);
      this.selectedActivity = castActivityWithDate(res);
    },
  },
});
