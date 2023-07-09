import { Gear } from "~/utils/models/catalog.model";

export interface GearRepository {
  find(gearName: string): Promise<Gear | undefined>;
}
