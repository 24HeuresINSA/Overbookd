import { WithAtLeastOneItem } from "@overbookd/list";
import { Adherent } from "../../common/adherent";
import { Location } from "../../common/location";

export type Contact = Adherent & {
  phone: string;
};

export type Volunteer = Adherent;

export type WithoutInChargeInstructions = {
  instruction: null;
  volunteers: [];
};

export type WithInChargeInstructions = {
  instruction: string;
  volunteers: WithAtLeastOneItem<Volunteer>;
};

export type DraftInstructions = {
  appointment: Location | null;
  contacts: Contact[];
  global: string | null;
  inCharge: {
    volunteers: Volunteer[];
    instruction: string | null;
  };
};

export type Instructions = {
  appointment: Location;
  contacts: WithAtLeastOneItem<Contact>;
  global: string;
  inCharge: WithoutInChargeInstructions | WithInChargeInstructions;
};
