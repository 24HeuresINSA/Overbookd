import type { Adherent, PayContributionForm } from "@overbookd/contribution";
import { HttpClient } from "~/utils/http/http-client";

export class ContributionRepository {
  private static readonly basePath = "contributions";

  static fetchAdherentsOutToDate() {
    return HttpClient.get<Adherent[]>(`${this.basePath}/out-to-date-adherents`);
  }

  static payContribution(form: PayContributionForm) {
    return HttpClient.post<Adherent>(this.basePath, form);
  }
}
