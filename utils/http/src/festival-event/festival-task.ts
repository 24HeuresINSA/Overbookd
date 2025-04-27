import {
  Adherent,
  Contact,
  FestivalTask,
  UpdateGeneral,
  UpdateInstructions,
  Volunteer,
  AddMobilization,
  TeamMobilization,
  FestivalTaskWithConflicts,
  FestivalTaskDraft,
  FestivalTaskReviewable,
  Reviewer,
} from "@overbookd/festival-event";

export type FestivalTaskCreationForm = {
  name: FestivalTask["general"]["name"];
  festivalActivityId: FestivalTask["festivalActivity"]["id"];
};

export type UpdateGeneralForm = Omit<UpdateGeneral, "administrator"> & {
  administratorId?: Adherent["id"];
};

export type UpdateInstructionsForm = Omit<UpdateInstructions, "appointment"> & {
  appointmentId?: number;
};

export type AddContactForm = {
  contactId: Contact["id"];
};

export type UpdateInChargeVolunteersForm = {
  volunteersId: Volunteer["id"][];
};

export type InitInChargeForm = {
  volunteers: number[];
  instruction: string;
};

export type AddMobilizationForm = Omit<
  AddMobilization,
  "volunteers" | "teams"
> & {
  volunteers: Volunteer["id"][];
  teams: TeamMobilization[];
};

export type AddVolunteerToMobilizationForm = {
  volunteerId: Volunteer["id"];
};

export type Draft = Extract<FestivalTaskWithConflicts, FestivalTaskDraft>;
export type Reviewable = Extract<
  FestivalTaskWithConflicts,
  FestivalTaskReviewable
>;

export type ReviewIgnoreTask = {
  team: Reviewer<"FT">;
};
