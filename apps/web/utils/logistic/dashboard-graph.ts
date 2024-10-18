import type { ConsumableGearDetails, GearDetails } from "@overbookd/http";
import type { Tooltip } from "../chartjs-graph";
import { sumQuantities } from "./quantity";

export function listStockAndInquiriesSources(allDetails: GearDetails[]) {
  return function (tooltipItem: Tooltip) {
    const gearDetails = allDetails[tooltipItem.index];

    const isStock = tooltipItem.datasetIndex === 0;
    if (isStock) return stockSources(gearDetails);

    const isInquiry = tooltipItem.datasetIndex === 1;
    if (isInquiry) return inquirySources(gearDetails);
  };
}

function stockSources({ inventory, borrows, purchases }: GearDetails): string {
  const inventoryDetail = inventory > 0 ? `• Inventaire: ${inventory}` : "";
  const borrowsDetail =
    borrows.length > 0 ? `• Emprunts: ${sumQuantities(borrows)}` : "";
  const purchasesDetail =
    purchases.length > 0 ? `• Achats: ${sumQuantities(purchases)}` : "";

  return concatSources([inventoryDetail, borrowsDetail, purchasesDetail]);
}

function inquirySources({ activities, tasks }: GearDetails): string {
  const activitiesDetail =
    activities.length > 0 ? `• FA: ${sumQuantities(activities)}` : "";
  const tasksDetail = tasks.length > 0 ? `• FT: ${sumQuantities(tasks)}` : "";

  return concatSources([activitiesDetail, tasksDetail]);
}

function concatSources(sources: string[]): string {
  return sources.filter((details) => details !== "").join("\n");
}

export function isConsumable(
  inquiries: GearDetails[],
): inquiries is ConsumableGearDetails[] {
  return inquiries.some((inquiry) => Object.hasOwn(inquiry, "consumed"));
}
