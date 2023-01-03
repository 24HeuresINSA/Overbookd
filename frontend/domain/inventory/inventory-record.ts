import { Gear } from "~/utils/models/catalog.model";

export class InventoryRecord {
  constructor(
    public readonly gear: Gear,
    public readonly quantity: number,
    public readonly storage: string
  ) {}
}
