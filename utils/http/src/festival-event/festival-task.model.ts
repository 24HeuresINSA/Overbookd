import {
  Adherent,
  UpdateInstructions,
  Volunteer,
  AddMobilization,
  TeamMobilization,
} from "@overbookd/festival-event";
import { InquiryRequest } from "@overbookd/festival-event";
import { UpdateGeneral } from "@overbookd/festival-event";
import { FestivalTask } from "@overbookd/festival-event";

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
  contactId: Adherent["id"];
};

export type AddInChargeVolunteerForm = {
  volunteerId: Volunteer["id"];
};

export type AddMobilizationForm = Omit<
  AddMobilization,
  "volunteers" | "teams"
> & {
  volunteers: Adherent["id"][];
  teams: TeamMobilization[];
};
