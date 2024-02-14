import { Adherent } from "../../common/adherent";
import { Location } from "../../common/location";

export type Contact = Adherent & {
  phone: string;
};

export type Volunteer = Adherent;

type WithoutInChargeInstructions = {
  instruction: null;
  volunteers: [];
};

type WithInChargeInstructions = {
  instruction: string;
  volunteers: [Volunteer, ...Volunteer[]];
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
  contacts: [Contact, ...Contact[]];
  global: string;
  inCharge: WithoutInChargeInstructions | WithInChargeInstructions;
};
