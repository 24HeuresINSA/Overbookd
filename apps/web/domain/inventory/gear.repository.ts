import { Gear } from "~/utils/models/catalog.model";

export type GearRepository = {
  find(gearName: string): Promise<Gear | undefined>;
};
