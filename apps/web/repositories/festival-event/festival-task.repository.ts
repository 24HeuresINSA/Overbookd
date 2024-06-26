import type {
  AddInquiryRequestForm,
  AddContactForm,
  AddInChargeVolunteerForm,
  FestivalTaskCreationForm,
  UpdateGeneralForm,
  UpdateInstructionsForm,
  AddMobilizationForm,
  AddVolunteerToMobilizationForm,
  PublishFeedbackForm,
  Statistics,
  ReviewRejection,
  ReviewApproval,
  InitInChargeForm,
} from "@overbookd/http";
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
  FestivalTaskReadyToAssign,
  ForceInstructions,
  ReadyToAssignWithConflicts,
  FestivalTask,
} from "@overbookd/festival-event";
import { HttpClient } from "~/utils/http/http-client";

type ReadyToAssign = Extract<
  FestivalTaskWithConflicts,
  FestivalTaskReadyToAssign
>;

export class FestivalTaskRepository {
  private static readonly basePath = "festival-tasks";

  /* VIEW */
  static getAll() {
    return HttpClient.get<PreviewFestivalTask[]>(this.basePath);
  }

  static getOne(id: FestivalTaskWithConflicts["id"]) {
    return HttpClient.get<FestivalTaskWithConflicts>(`${this.basePath}/${id}`);
  }

  static getStats() {
    return HttpClient.get<Statistics<FestivalTask>[]>(
      `${this.basePath}/statistics`,
    );
  }

  /* CREATE */
  static create(data: FestivalTaskCreationForm) {
    return HttpClient.post<FestivalTaskWithConflicts>(this.basePath, data);
  }

  /* ASK FOR REVIEW */
  static askForReview(id: FestivalTaskWithConflicts["id"]) {
    return HttpClient.post<FestivalTaskWithConflicts>(
      `${this.basePath}/${id}/ask-for-review`,
    );
  }

  /* REMOVE */
  static remove(id: FestivalTaskWithConflicts["id"]) {
    return HttpClient.delete<void>(`${this.basePath}/${id}`);
  }

  /* UPDATE GENERAL */
  static updateGeneral(
    ftId: FestivalTaskWithConflicts["id"],
    general: UpdateGeneralForm,
  ) {
    return HttpClient.patch<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/general`,
      general,
    );
  }

  /* UPDATE INSTRUCTIONS */
  static updateInstructions(
    ftId: FestivalTaskWithConflicts["id"],
    instructions: UpdateInstructionsForm,
  ) {
    return HttpClient.patch<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/instructions`,
      instructions,
    );
  }

  static forceInstructions(
    ftId: FestivalTaskWithConflicts["id"],
    instructions: ForceInstructions,
  ) {
    return HttpClient.patch<ReadyToAssignWithConflicts>(
      `${this.basePath}/${ftId}/force/instructions`,
      instructions,
    );
  }

  static addContact(
    ftId: FestivalTaskWithConflicts["id"],
    contact: AddContactForm,
  ) {
    return HttpClient.post<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/instructions/contacts`,
      contact,
    );
  }

  static removeContact(
    ftId: FestivalTaskWithConflicts["id"],
    contactId: Contact["id"],
  ) {
    return HttpClient.delete<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/instructions/contacts/${contactId}`,
    );
  }

  static addInChargeVolunteer(
    ftId: FestivalTaskWithConflicts["id"],
    volunteer: AddInChargeVolunteerForm,
  ) {
    return HttpClient.post<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/instructions/in-charge/volunteers`,
      volunteer,
    );
  }

  static removeInChargeVolunteer(
    ftId: FestivalTaskWithConflicts["id"],
    volunteerId: Volunteer["id"],
  ) {
    return HttpClient.delete<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/instructions/in-charge/volunteers/${volunteerId}`,
    );
  }

  static initInCharge(
    ftId: FestivalTaskWithConflicts["id"],
    form: InitInChargeForm,
  ) {
    return HttpClient.post<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/instructions/in-charge`,
      form,
    );
  }

  static clearInCharge(ftId: FestivalTaskWithConflicts["id"]) {
    return HttpClient.delete<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/instructions/in-charge`,
    );
  }

  /* UPDATE MOBILIZATION */
  static addMobilization(
    ftId: FestivalTaskWithConflicts["id"],
    mobilization: AddMobilizationForm,
  ) {
    return HttpClient.post<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/mobilizations`,
      mobilization,
    );
  }

  static updateMobilization(
    ftId: FestivalTaskWithConflicts["id"],
    mobilizationId: Mobilization["id"],
    mobilization: UpdateMobilization,
  ) {
    return HttpClient.patch<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/mobilizations/${mobilizationId}`,
      mobilization,
    );
  }

  static removeMobilization(
    ftId: FestivalTaskWithConflicts["id"],
    mobilizationId: Mobilization["id"],
  ) {
    return HttpClient.delete<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/mobilizations/${mobilizationId}`,
    );
  }

  static addVolunteerToMobilization(
    ftId: FestivalTaskWithConflicts["id"],
    mobilizationId: Mobilization["id"],
    volunteer: AddVolunteerToMobilizationForm,
  ) {
    return HttpClient.post<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/mobilizations/${mobilizationId}/volunteers`,
      volunteer,
    );
  }

  static removeVolunteerFromMobilization(
    ftId: FestivalTaskWithConflicts["id"],
    mobilizationId: Mobilization["id"],
    volunteerId: Volunteer["id"],
  ) {
    return HttpClient.delete<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/mobilizations/${mobilizationId}/volunteers/${volunteerId}`,
    );
  }

  static addTeamToMobilization(
    ftId: FestivalTaskWithConflicts["id"],
    mobilizationId: Mobilization["id"],
    team: TeamMobilization,
  ) {
    return HttpClient.post<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/mobilizations/${mobilizationId}/teams`,
      team,
    );
  }

  static removeTeamFromMobilization(
    ftId: FestivalTaskWithConflicts["id"],
    mobilizationId: Mobilization["id"],
    team: TeamMobilization["team"],
  ) {
    return HttpClient.delete<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/mobilizations/${mobilizationId}/teams/${team}`,
    );
  }

  /* UPDATE INQUIRY */
  static addInquiryRequest(
    ftId: FestivalTaskWithConflicts["id"],
    inquiry: AddInquiryRequestForm,
  ) {
    return HttpClient.post<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/inquiry/requests`,
      inquiry,
    );
  }

  static removeInquiryRequest(
    ftId: FestivalTaskWithConflicts["id"],
    inquirySlug: InquiryRequest["slug"],
  ) {
    return HttpClient.delete<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/inquiry/requests/${inquirySlug}`,
    );
  }

  static linkDrive(
    ftId: FestivalTaskWithConflicts["id"],
    { slug, drive }: AssignDrive,
  ) {
    return HttpClient.patch<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/inquiry/requests/${slug}`,
      { drive },
    );
  }

  /* PUBLISH FEEDBACK */
  static publishFeedback(
    ftId: FestivalTaskWithConflicts["id"],
    feedback: PublishFeedbackForm,
  ) {
    return HttpClient.post<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/feedbacks`,
      feedback,
    );
  }

  static reject(
    ftId: FestivalTaskWithConflicts["id"],
    rejection: ReviewRejection<"FT">,
  ) {
    return HttpClient.post<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/reject`,
      rejection,
    );
  }

  static approve(
    ftId: FestivalTaskWithConflicts["id"],
    approval: ReviewApproval<"FT">,
  ) {
    return HttpClient.post<FestivalTaskWithConflicts>(
      `${this.basePath}/${ftId}/approve`,
      approval,
    );
  }

  static enableAssignment(
    ftId: FestivalTaskWithConflicts["id"],
    categorize: Categorize,
  ) {
    return HttpClient.post<ReadyToAssign>(
      `${this.basePath}/${ftId}/enable-assignment`,
      categorize,
    );
  }
}
