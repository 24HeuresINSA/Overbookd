import { Period } from "./period";

export interface CharismaPeriod extends Period {
  name: string;
  description: string;
  charisma: number;
}

export interface SavedCharismaPeriod extends CharismaPeriod {
  id: number;
}
