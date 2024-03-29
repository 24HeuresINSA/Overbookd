import {
  ConsumableGearDetails,
  GearBorrow,
  GearDetails,
  GearDetailsInquiry,
} from "@overbookd/http";
import { Tooltip } from "../graph/graph";

export function listStockAndInquiriesSources(allDetails: GearDetails[]) {
  return function (tooltipItem: Tooltip) {
    const gearDetails = allDetails[tooltipItem.index];

    const isStock = tooltipItem.datasetIndex === 0;
    if (isStock) return `${listAllStockSources(gearDetails)}\n`;

    const isInquiry = tooltipItem.datasetIndex === 1;
    if (isInquiry) return listAllInquirySources(gearDetails);
  };
}

function listAllStockSources({ inventory, borrows }: GearDetails): string {
  const inventoryDetail = inventory > 0 ? `Inventaire: ${inventory}` : "";
  const borrowsDetails = listStockSources({
    title: "Emprunts",
    sources: borrows,
  });
  return concatSources([inventoryDetail, borrowsDetails]);
}

function listAllInquirySources({ activities, tasks }: GearDetails): string {
  const faDetails = listInquirySources({
    title: "FA",
    sources: activities,
  });
  const ftDetails = listInquirySources({
    title: "FT",
    sources: tasks,
  });
  return concatSources([faDetails, ftDetails]);
}

function concatSources(sources: string[]): string {
  return sources.filter((details) => details !== "").join("\n");
}

export function listInquirySources({
  title,
  sources,
}: {
  title: string;
  sources: GearDetailsInquiry[];
}): string {
  if (sources.length === 0) return "";
  const bullet = "•";
  const sourceListing = sources.map(
    ({ id, name, quantity }) => `${bullet} #${id}-${name}: ${quantity}`,
  );
  return [title, ...sourceListing].join("\n");
}

export function listStockSources({
  title,
  sources,
}: {
  title: string;
  sources: GearBorrow[];
}): string {
  if (sources.length === 0) return "";
  const bullet = "•";
  const sourceListing = sources.map(
    ({ lender, quantity }) => `${bullet} ${lender}: ${quantity}`,
  );
  return [title, ...sourceListing].join("\n");
}

export function isConsumable(
  inquiries: GearDetails[],
): inquiries is ConsumableGearDetails[] {
  return inquiries.some((inquiry) => Object.hasOwn(inquiry, "consumed"));
}
