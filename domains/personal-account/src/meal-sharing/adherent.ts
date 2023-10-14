import { Adherent } from "./adherent";

export type Adherent = {
  id: number;
  name: string;
};
export type Shotgun = Adherent & {
  date: Date;
};
