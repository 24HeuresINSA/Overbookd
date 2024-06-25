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
  type Reviewer,
  type LinkSignageCatalogItem,
  type AssignDrive,
  defaultDraft,
} from "@overbookd/festival-event";
import type {
  PrepareInChargeForm,
  PrepareSignaForm,
  ReviewRejection,
  InitInquiryRequest,
  PreviewForSecurity,
  PreviewForCommunication,
  PublishFeedbackForm,
} from "@overbookd/http";
import type { IProvidePeriod } from "@overbookd/period";
import { FestivalActivityRepository } from "~/repositories/festival-event/festival-activity.repository";
import {
  castActivityWithDate,
  castPreviewForCommunicationWithDate,
  castPreviewForSecurityWithDate,
} from "~/utils/festival-event/festival-activity/festival-activity.utils";
import type { AddInquiryRequestForm } from "@overbookd/http";
import { isSuccess } from "~/utils/http/api-fetch";
import { sendNotification } from "~/utils/notification/send-notification";

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

export const useFestivalActivityStore = defineStore("festival-activity", {
  state: (): State => ({
    activities: {
      forAll: [],
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
      if (!isSuccess(res)) return;
      this.activities.forAll = res;
    },

    async fetchSecurityPreviews() {
      const res = await repo.getSecurityPreviews();
      if (!isSuccess(res)) return;
      this.activities.forSecurity = res.map(castPreviewForSecurityWithDate);
    },

    async fetchCommunicationPreviews() {
      const res = await repo.getCommunicationPreviews();
      if (!isSuccess(res)) return;
      this.activities.forCommunication = res.map(
        castPreviewForCommunicationWithDate,
      );
    },

    async fetchLogisticPreviews() {
      const res = await repo.getCSVLogisticPreviews();
      if (!isSuccess(res)) return;
      this.activities.forLogistic.csv = res;
    },

    async fetchActivity(id: number) {
      const res = await repo.getOne(id);
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    /* CREATE */
    async create(form: CreateFestivalActivityForm) {
      const res = await repo.create(form);
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
      await this.fetchAllActivities();
    },

    /* ASK FOR REVIEW */
    async askForReview() {
      const res = await repo.askForReview(this.selectedActivity.id);
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
      await this.fetchAllActivities();
    },

    /* REMOVE */
    async remove(id: FestivalActivity["id"]) {
      const res = await repo.remove(id);
      if (!isSuccess(res)) return;
      sendNotification(`FA #${id} supprimée 🗑️`);
      this.selectedActivity = fakeActivity;
      await this.fetchAllActivities();
    },

    /* UPDATE GENERAL SECTION */
    async updateGeneral(general: PrepareGeneralUpdate) {
      const res = await repo.updateGeneral(this.selectedActivity.id, general);
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async addGeneralTimeWindow(timeWindow: IProvidePeriod) {
      const res = await repo.addGeneralTimeWindow(
        this.selectedActivity.id,
        timeWindow,
      );
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async removeGeneralTimeWindow(timeWindowId: TimeWindow["id"]) {
      const res = await repo.removeGeneralTimeWindow(
        this.selectedActivity.id,
        timeWindowId,
      );
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    /* UPDATE IN CHARGE SECTION */
    async updateInCharge(inCharge: PrepareInChargeForm) {
      const res = await repo.updateInCharge(this.selectedActivity.id, inCharge);
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async addContractor(contractor: PrepareContractorCreation) {
      const res = await repo.addContractor(
        this.selectedActivity.id,
        contractor,
      );
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async updateContractor(contractor: PrepareContractorUpdate) {
      const res = await repo.updateContractor(
        this.selectedActivity.id,
        contractor,
      );
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async removeContractor(contractorId: Contractor["id"]) {
      const res = await repo.removeContractor(
        this.selectedActivity.id,
        contractorId,
      );
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    /* UPDATE SIGNA SECTION */
    async updateSigna(signa: PrepareSignaForm) {
      const res = await repo.updateSigna(this.selectedActivity.id, signa);
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async addSignage(signage: PrepareSignageCreation) {
      const res = await repo.addSignage(this.selectedActivity.id, signage);
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async updateSignage(signage: PrepareSignageUpdate) {
      const res = await repo.updateSignage(this.selectedActivity.id, signage);
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async removeSignage(signageId: Signage["id"]) {
      const res = await repo.removeSignage(this.selectedActivity.id, signageId);
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async linkSignageCatalogItem({
      signageId,
      catalogItem,
    }: LinkSignageCatalogItem) {
      const form = { catalogItemId: catalogItem.id };
      const res = await repo.linkSignageCatalogItem(
        this.selectedActivity.id,
        signageId,
        form,
      );
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    /* UPDATE SECURITY SECTION */
    async updateSecurity(security: PrepareSecurityUpdate) {
      const res = await repo.updateSecurity(this.selectedActivity.id, security);
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    /* UPDATE SUPPLY SECTION */
    async updateSupply(supply: PrepareSupplyUpdate) {
      const res = await repo.updateSupply(this.selectedActivity.id, supply);
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async addElectricitySupply(supply: PrepareElectricitySupplyCreation) {
      const res = await repo.addElectricitySupply(
        this.selectedActivity.id,
        supply,
      );
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async updateElectricitySupply(supply: PrepareElectricitySupplyUpdate) {
      const res = await repo.updateElectricitySupply(
        this.selectedActivity.id,
        supply,
      );
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async removeElectricitySupply(supplyId: ElectricitySupply["id"]) {
      const res = await repo.removeElectricitySupply(
        this.selectedActivity.id,
        supplyId,
      );
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    /* UPDATE INQUIRY */
    async addInquiryTimeWindow(timeWindow: IProvidePeriod) {
      const res = await repo.addInquiryTimeWindow(
        this.selectedActivity.id,
        timeWindow,
      );
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async removeInquiryTimeWindow(timeWindowId: TimeWindow["id"]) {
      const res = await repo.removeInquiryTimeWindow(
        this.selectedActivity.id,
        timeWindowId,
      );
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async addInquiryRequest(request: AddInquiryRequestForm) {
      const res = await repo.addInquiryRequest(
        this.selectedActivity.id,
        request,
      );
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async removeInquiryRequest(slug: InquiryRequest["slug"]) {
      const res = await repo.removeInquiryRequest(
        this.selectedActivity.id,
        slug,
      );
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async initInquiry(form: InitInquiryRequest) {
      const res = await repo.initInquiry(this.selectedActivity.id, form);
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async clearInquiry() {
      const res = await repo.clearInquiry(this.selectedActivity.id);
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    async linkDrive(link: AssignDrive) {
      const res = await repo.linkDrive(this.selectedActivity.id, link);
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    /* PUBLISH FEEDBACK */
    async publishFeedback(feedback: PublishFeedbackForm) {
      const res = await repo.publishFeedback(
        this.selectedActivity.id,
        feedback,
      );
      if (!isSuccess(res)) return;
      this.selectedActivity = castActivityWithDate(res);
    },

    /* REVIEW */
    async approveAs(reviewer: Reviewer<"FA">) {
      const res = await repo.approve(this.selectedActivity.id, reviewer);
      if (!isSuccess(res)) return;
      sendNotification(`✅ FA approuvée par l'équipe ${reviewer}`);
      this.selectedActivity = castActivityWithDate(res);
    },

    async rejectBecause(rejection: ReviewRejection<"FA">) {
      const res = await repo.reject(this.selectedActivity.id, rejection);
      if (!isSuccess(res)) return;
      sendNotification(`🛑 FA rejetée par l'équipe ${rejection.team}`);
      this.selectedActivity = castActivityWithDate(res);
    },
  },
});
