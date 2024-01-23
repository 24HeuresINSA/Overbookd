import {
  Adherent,
  UpdateInstructions,
  Volunteer,
} from "@overbookd/festival-event";
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
