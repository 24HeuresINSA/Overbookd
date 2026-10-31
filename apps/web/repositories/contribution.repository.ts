import type {
  Adherent,
  AdherentWithContribution,
  ContributionType,
  EditContributionForm,
  PayContributionForm,
} from "@overbookd/contribution";
import { HttpClient } from "~/utils/http/http-client";

export class ContributionRepository {
  private static readonly basePath = "contributions";

  static fetchAdherentsOutToDate() {
    return HttpClient.get<Adherent[]>(`${this.basePath}/out-to-date-adherents`);
  }

  static fetchAdherentsWithValidContribution() {
    return HttpClient.get<AdherentWithContribution[]>(
      `${this.basePath}/valid-adherents`,
    );
  }

  static payContribution(form: PayContributionForm) {
    return HttpClient.post<void>(this.basePath, form);
  }

  static editContribution(
    adherentId: number,
    edition: number,
    type: ContributionType,
  ) {
    const form: EditContributionForm = { type };
    return HttpClient.patch<void>(
      `${this.basePath}/adherents/${adherentId}/editions/${edition}`,
      form,
    );
  }

  static removeContribution(adherentId: number, edition: number) {
    return HttpClient.delete<void>(
      `${this.basePath}/adherents/${adherentId}/editions/${edition}`,
    );
  }
}
