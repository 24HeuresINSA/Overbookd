import { SummaryGearPreview } from "@overbookd/http";
import { SummaryGearOrchestrator } from "./summary-gear-orchestrator";
import { DatabaseGearPreview } from "./summary-gear.model";

export class SummaryGear {
  private constructor() {}

  public static generatePreview(gear: DatabaseGearPreview): SummaryGearPreview {
    const stockDiscrepancy =
      SummaryGearOrchestrator.computeStockDiscrepancyOn(gear);
    return {
      id: gear.id,
      name: gear.name,
      slug: gear.slug,
      isConsumable: gear.isConsumable,
      stockDiscrepancy,
    };
  }
}
