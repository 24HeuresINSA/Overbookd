import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  AddInquiryRequestForm,
  AddContactForm,
  AddInChargeVolunteerForm,
  FestivalTaskCreationForm,
  HttpStringified,
  UpdateGeneralForm,
  UpdateInstructionsForm,
  AddMobilizationForm,
  AddVolunteerToMobilizationForm,
  PublishFeedbackForm,
  Statistics,
} from "@overbookd/http";
import {
  PreviewFestivalTask,
  InquiryRequest,
  Contact,
  Volunteer,
  UpdateMobilization,
  Mobilization,
  TeamMobilization,
  FestivalTaskWithConflicts,
} from "@overbookd/festival-event";

type Context = { $axios: NuxtAxiosInstance };

export class FestivalTaskRepository {
  private static readonly basePath = "festival-tasks";

  /* VIEW */
  static getAll(context: Context) {
    return context.$axios.get<HttpStringified<PreviewFestivalTask>[]>(
      this.basePath,
    );
  }

  static getOne(context: Context, id: FestivalTaskWithConflicts["id"]) {
    return context.$axios.get<HttpStringified<FestivalTaskWithConflicts>>(
      `${this.basePath}/${id}`,
    );
  }

  static getStats(context: Context) {
    return context.$axios.get<
      HttpStringified<Statistics<FestivalTaskWithConflicts>>
    >(`${this.basePath}/statistics`);
  }

  /* CREATE */
  static create(context: Context, data: FestivalTaskCreationForm) {
    return context.$axios.post<HttpStringified<FestivalTaskWithConflicts>>(
      this.basePath,
      data,
    );
  }

  /* REMOVE */
  static remove(context: Context, id: FestivalTaskWithConflicts["id"]) {
    return context.$axios.delete<void>(`${this.basePath}/${id}`);
  }

  /* UPDATE GENERAL */
  static updateGeneral(
    context: Context,
    ftId: FestivalTaskWithConflicts["id"],
    general: UpdateGeneralForm,
  ) {
    return context.$axios.patch<HttpStringified<FestivalTaskWithConflicts>>(
      `${this.basePath}/${ftId}/general`,
      general,
    );
  }

  /* UPDATE INSTRUCTIONS */
  static updateInstructions(
    context: Context,
    ftId: FestivalTaskWithConflicts["id"],
    instructions: UpdateInstructionsForm,
  ) {
    return context.$axios.patch<HttpStringified<FestivalTaskWithConflicts>>(
      `${this.basePath}/${ftId}/instructions`,
      instructions,
    );
  }

  static addContact(
    context: Context,
    ftId: FestivalTaskWithConflicts["id"],
    contact: AddContactForm,
  ) {
    return context.$axios.post<HttpStringified<FestivalTaskWithConflicts>>(
      `${this.basePath}/${ftId}/instructions/contacts`,
      contact,
    );
  }

  static removeContact(
    context: Context,
    ftId: FestivalTaskWithConflicts["id"],
    contactId: Contact["id"],
  ) {
    return context.$axios.delete<HttpStringified<FestivalTaskWithConflicts>>(
      `${this.basePath}/${ftId}/instructions/contacts/${contactId}`,
    );
  }

  static addInChargeVolunteer(
    context: Context,
    ftId: FestivalTaskWithConflicts["id"],
    volunteer: AddInChargeVolunteerForm,
  ) {
    return context.$axios.post<HttpStringified<FestivalTaskWithConflicts>>(
      `${this.basePath}/${ftId}/instructions/in-charge/volunteers`,
      volunteer,
    );
  }

  static removeInChargeVolunteer(
    context: Context,
    ftId: FestivalTaskWithConflicts["id"],
    volunteerId: Volunteer["id"],
  ) {
    return context.$axios.delete<HttpStringified<FestivalTaskWithConflicts>>(
      `${this.basePath}/${ftId}/instructions/in-charge/volunteers/${volunteerId}`,
    );
  }

  static clearInCharge(
    context: Context,
    ftId: FestivalTaskWithConflicts["id"],
  ) {
    return context.$axios.delete<HttpStringified<FestivalTaskWithConflicts>>(
      `${this.basePath}/${ftId}/instructions/in-charge`,
    );
  }

  /* UPDATE MOBILIZATION */
  static addMobilization(
    context: Context,
    ftId: FestivalTaskWithConflicts["id"],
    mobilization: AddMobilizationForm,
  ) {
    return context.$axios.post<HttpStringified<FestivalTaskWithConflicts>>(
      `${this.basePath}/${ftId}/mobilizations`,
      mobilization,
    );
  }

  static updateMobilization(
    context: Context,
    ftId: FestivalTaskWithConflicts["id"],
    mobilizationId: Mobilization["id"],
    mobilization: UpdateMobilization,
  ) {
    return context.$axios.patch<HttpStringified<FestivalTaskWithConflicts>>(
      `${this.basePath}/${ftId}/mobilizations/${mobilizationId}`,
      mobilization,
    );
  }

  static removeMobilization(
    context: Context,
    ftId: FestivalTaskWithConflicts["id"],
    mobilizationId: Mobilization["id"],
  ) {
    return context.$axios.delete<HttpStringified<FestivalTaskWithConflicts>>(
      `${this.basePath}/${ftId}/mobilizations/${mobilizationId}`,
    );
  }

  static addVolunteerToMobilization(
    context: Context,
    ftId: FestivalTaskWithConflicts["id"],
    mobilizationId: Mobilization["id"],
    volunteer: AddVolunteerToMobilizationForm,
  ) {
    return context.$axios.post<HttpStringified<FestivalTaskWithConflicts>>(
      `${this.basePath}/${ftId}/mobilizations/${mobilizationId}/volunteers`,
      volunteer,
    );
  }

  static removeVolunteerFromMobilization(
    context: Context,
    ftId: FestivalTaskWithConflicts["id"],
    mobilizationId: Mobilization["id"],
    volunteerId: Volunteer["id"],
  ) {
    return context.$axios.delete<HttpStringified<FestivalTaskWithConflicts>>(
      `${this.basePath}/${ftId}/mobilizations/${mobilizationId}/volunteers/${volunteerId}`,
    );
  }

  static addTeamToMobilization(
    context: Context,
    ftId: FestivalTaskWithConflicts["id"],
    mobilizationId: Mobilization["id"],
    team: TeamMobilization,
  ) {
    return context.$axios.post<HttpStringified<FestivalTaskWithConflicts>>(
      `${this.basePath}/${ftId}/mobilizations/${mobilizationId}/teams`,
      team,
    );
  }

  static removeTeamFromMobilization(
    context: Context,
    ftId: FestivalTaskWithConflicts["id"],
    mobilizationId: Mobilization["id"],
    team: TeamMobilization["team"],
  ) {
    return context.$axios.delete<HttpStringified<FestivalTaskWithConflicts>>(
      `${this.basePath}/${ftId}/mobilizations/${mobilizationId}/teams/${team}`,
    );
  }

  /* UPDATE INQUIRY */
  static addInquiryRequest(
    context: Context,
    ftId: FestivalTaskWithConflicts["id"],
    inquiry: AddInquiryRequestForm,
  ) {
    return context.$axios.post<HttpStringified<FestivalTaskWithConflicts>>(
      `${this.basePath}/${ftId}/inquiry/requests`,
      inquiry,
    );
  }

  static removeInquiryRequest(
    context: Context,
    ftId: FestivalTaskWithConflicts["id"],
    inquirySlug: InquiryRequest["slug"],
  ) {
    return context.$axios.delete<HttpStringified<FestivalTaskWithConflicts>>(
      `${this.basePath}/${ftId}/inquiry/requests/${inquirySlug}`,
    );
  }

  /* PUBLISH FEEDBACK */
  static publishFeedback(
    context: Context,
    ftId: FestivalTaskWithConflicts["id"],
    feedback: PublishFeedbackForm,
  ) {
    return context.$axios.post<HttpStringified<FestivalTaskWithConflicts>>(
      `${this.basePath}/${ftId}/feedbacks`,
      feedback,
    );
  }
}
