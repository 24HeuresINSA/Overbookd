import type {
  PreviewFestivalTask,
  InquiryRequest,
  Contact,
  Volunteer,
  UpdateMobilization,
  Mobilization,
  TeamMobilization,
  FestivalTaskWithConflicts,
  AssignDrive,
  Categorize,
  ForceInstructions,
} from "@overbookd/festival-event";
import type {
  AddInquiryRequestForm,
  AddMobilizationForm,
  FestivalTaskCreationForm,
  InitInChargeForm,
  PublishFeedbackForm,
  ReviewApproval,
  ReviewRejection,
  UpdateGeneralForm,
  UpdateInstructionsForm,
} from "@overbookd/http";
import { DRAFT } from "@overbookd/festival-event-constants";
import { FestivalTaskRepository } from "~/repositories/festival-event/festival-task.repository";
import { castTaskWithDate } from "~/utils/festival-event/festival-task/festival-task.utils";
import {
  type Assignment,
  type AssignmentIdentifier,
  isWithDetails,
} from "@overbookd/assignment";
import { AssignmentsRepository } from "~/repositories/assignment/assignments.repository";
import {
  type UnassignForm,
  castAssignmentWithDate,
} from "~/utils/assignment/assignment";
import { isSuccess } from "~/utils/http/api-fetch";
import { sendNotification } from "~/utils/notification/send-notification";

const repo = FestivalTaskRepository;

type State = {
  tasks: {
    forAll: PreviewFestivalTask[];
  };
  selectedTask: FestivalTaskWithConflicts;
  assignmentDetails: Assignment<{ withDetails: true }> | null;
};

const fakeTask: FestivalTaskWithConflicts = {
  id: 0,
  status: DRAFT,
  festivalActivity: {
    id: 0,
    name: "",
    status: DRAFT,
    timeWindows: [],
    location: null,
    hasSupplyRequest: false,
    inquiry: { all: [], timeWindows: [] },
  },
  general: {
    name: "",
    administrator: { id: 0, firstname: "", lastname: "" },
    team: null,
  },
  instructions: {
    contacts: [],
    appointment: null,
    global: null,
    inCharge: { instruction: null, volunteers: [] },
  },
  feedbacks: [],
  inquiries: [],
  history: [],
  mobilizations: [],
};

export const useFestivalTaskStore = defineStore("festival-task", {
  state: (): State => ({
    tasks: {
      forAll: [],
    },
    selectedTask: fakeTask,
    assignmentDetails: null,
  }),
  actions: {
    /* VIEW */
    async fetchAllTasks() {
      const res = await repo.getAll();
      if (!isSuccess(res)) return;
      this.tasks.forAll = res;
    },

    async fetchTask(id: number) {
      const res = await repo.getOne(id);
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    /* CREATE */
    async create(form: FestivalTaskCreationForm) {
      const res = await repo.create(form);
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
      await this.fetchAllTasks();
    },

    /* ASK FOR REVIEW */
    async askForReview() {
      const res = await repo.askForReview(this.selectedTask.id);
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
      await this.fetchAllTasks();
    },

    /* REMOVE */
    async remove(id: FestivalTaskWithConflicts["id"]) {
      const res = await repo.remove(id);
      if (!isSuccess(res)) return;
      sendNotification(`FT #${id} supprimée 🗑️`);
      this.selectedTask = fakeTask;
      await this.fetchAllTasks();
    },

    /* UPDATE GENERAL SECTION */
    async updateGeneral(general: UpdateGeneralForm) {
      const res = await repo.updateGeneral(this.selectedTask.id, general);
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    /* UPDATE INSTRUCTIONS SECTION */
    async updateInstructions(instructions: UpdateInstructionsForm) {
      const res = await repo.updateInstructions(
        this.selectedTask.id,
        instructions,
      );
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    async forceInstructions(instructions: ForceInstructions) {
      const res = await repo.forceInstructions(
        this.selectedTask.id,
        instructions,
      );
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    async addContact(contactId: Contact["id"]) {
      const res = await repo.addContact(this.selectedTask.id, { contactId });
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    async removeContact(contactId: Contact["id"]) {
      const res = await repo.removeContact(this.selectedTask.id, contactId);
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    async addInChargeVolunteer(volunteerId: Volunteer["id"]) {
      const res = await repo.addInChargeVolunteer(this.selectedTask.id, {
        volunteerId,
      });
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    async removeInChargeVolunteer(volunteerId: Volunteer["id"]) {
      const res = await repo.removeInChargeVolunteer(
        this.selectedTask.id,
        volunteerId,
      );
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    async initInCharge(form: InitInChargeForm) {
      const res = await repo.initInCharge(this.selectedTask.id, form);
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    async clearInCharge() {
      const res = await repo.clearInCharge(this.selectedTask.id);
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    /* UPDATE MOBILIZATION SECTION */
    async addMobilization(mobilization: AddMobilizationForm) {
      const res = await repo.addMobilization(
        this.selectedTask.id,
        mobilization,
      );
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    async updateMobilization(
      mobilizationId: Mobilization["id"],
      mobilization: UpdateMobilization,
    ) {
      const res = await repo.updateMobilization(
        this.selectedTask.id,
        mobilizationId,
        mobilization,
      );
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    async removeMobilization(mobilizationId: Mobilization["id"]) {
      const res = await repo.removeMobilization(
        this.selectedTask.id,
        mobilizationId,
      );
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    async addVolunteerToMobilization(
      mobilizationId: Mobilization["id"],
      volunteerId: Volunteer["id"],
    ) {
      const form = { volunteerId };
      const res = await repo.addVolunteerToMobilization(
        this.selectedTask.id,
        mobilizationId,
        form,
      );
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    async removeVolunteerFromMobilization(
      mobilizationId: Mobilization["id"],
      volunteerId: Volunteer["id"],
    ) {
      const res = await repo.removeVolunteerFromMobilization(
        this.selectedTask.id,
        mobilizationId,
        volunteerId,
      );
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    async addTeamToMobilization(
      mobilizationId: Mobilization["id"],
      team: TeamMobilization,
    ) {
      const res = await repo.addTeamToMobilization(
        this.selectedTask.id,
        mobilizationId,
        team,
      );
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    async removeTeamFromMobilization(
      mobilizationId: Mobilization["id"],
      team: TeamMobilization["team"],
    ) {
      const res = await repo.removeTeamFromMobilization(
        this.selectedTask.id,
        mobilizationId,
        team,
      );
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    /* UPDATE INQUIRY SECTION */
    async addInquiryRequest(inquiry: AddInquiryRequestForm) {
      const res = await repo.addInquiryRequest(this.selectedTask.id, inquiry);
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    async removeInquiryRequest(inquirySlug: InquiryRequest["slug"]) {
      const res = await repo.removeInquiryRequest(
        this.selectedTask.id,
        inquirySlug,
      );
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    async linkDrive(link: AssignDrive) {
      const res = await repo.linkDrive(this.selectedTask.id, link);
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    /* PUBLISH FEEDBACK */
    async publishFeedback(feedback: PublishFeedbackForm) {
      const res = await repo.publishFeedback(this.selectedTask.id, feedback);
      if (!isSuccess(res)) return;
      this.selectedTask = castTaskWithDate(res);
    },

    /* REVIEW */
    async rejectBecause(rejection: ReviewRejection<"FT">) {
      const res = await repo.reject(this.selectedTask.id, rejection);
      if (!isSuccess(res)) return;
      sendNotification(`🛑 FT rejetée par l'équipe ${rejection.team}`);
      this.selectedTask = castTaskWithDate(res);
    },

    async approve(approval: ReviewApproval<"FT">) {
      const res = await repo.approve(this.selectedTask.id, approval);
      if (!isSuccess(res)) return;
      sendNotification(`✅ FT approuvée par l'équipe ${approval.team}`);
      this.selectedTask = castTaskWithDate(res);
    },

    /* ASSIGNMENT */
    async enableAssignment(categorize: Categorize) {
      const res = await repo.enableAssignment(this.selectedTask.id, categorize);
      if (!isSuccess(res)) return;
      sendNotification("✅ FT prête pour affectation");
      this.selectedTask = castTaskWithDate(res);
    },

    async fetchAssignmentDetails(assignmentIdentifier: AssignmentIdentifier) {
      const res = await AssignmentsRepository.findOne(
        assignmentIdentifier,
        true,
      );
      if (!isSuccess(res)) return;
      const assignment = castAssignmentWithDate(res);
      if (!isWithDetails(assignment)) return;
      this.assignmentDetails = assignment;
    },

    async unassign({ assignmentIdentifier, assigneeId }: UnassignForm) {
      const repository = new AssignmentsRepository();
      await repository.unassign(assignmentIdentifier, assigneeId);
      this.fetchAssignmentDetails(assignmentIdentifier);
    },
  },
});
