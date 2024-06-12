import { Adherent } from "../../common/adherent.js";

export type DraftGeneral = {
  name: string;
  administrator: Adherent;
  team: string | null;
};

export type General = {
  name: string;
  administrator: Adherent;
  team: string;
};
