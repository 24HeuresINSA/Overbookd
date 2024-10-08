import { SlugifyService } from "@overbookd/slugify";
import type { UserName } from "@overbookd/user";

export function downloadPlanning(
  planningBase64Data: string,
  volunteer: UserName,
) {
  const base64Uri = `data:application/pdf;base64,${planningBase64Data}`;
  const firstname = SlugifyService.apply(volunteer.firstname);
  const lastname = SlugifyService.apply(volunteer.lastname);
  const fileName = `${lastname}_${firstname}_planning.pdf`;
  const downloadLink = document.createElement("a");
  downloadLink.href = base64Uri;
  downloadLink.download = fileName;
  downloadLink.click();
}
