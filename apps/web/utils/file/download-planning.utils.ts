import { SlugifyService } from "@overbookd/slugify";
import type { UserName } from "@overbookd/user";

export function downloadPdfFromBase64(
  planningBase64Data: string,
  fileName: string,
) {
  const base64Uri = `data:application/pdf;base64,${planningBase64Data}`;
  const downloadLink = document.createElement("a");
  downloadLink.href = base64Uri;
  downloadLink.download = fileName;
  downloadLink.click();
}

export function downloadPdfPlanning(
  planningBase64Data: string,
  volunteer: UserName,
) {
  const firstname = SlugifyService.apply(volunteer.firstname);
  const lastname = SlugifyService.apply(volunteer.lastname);
  const fileName = `${lastname}_${firstname}_planning.pdf`;
  downloadPdfFromBase64(planningBase64Data, fileName);
}
