import { SlugifyService } from '~/domain/common/slugify.service';
import { DisplayedUser } from '../models/user';

export function download(planningBase64Data: string, volunteer: DisplayedUser) {
  const base64Uri = `data:application/pdf;base64,${planningBase64Data}`;
  const firstname = SlugifyService.apply(volunteer.firstname);
  const lastname = SlugifyService.apply(volunteer.lastname);
  const fileName = `${lastname}_${firstname}_planning.pdf`;
  const downloadLink = document.createElement('a');
  downloadLink.href = base64Uri;
  downloadLink.download = fileName;
  downloadLink.click();
}
