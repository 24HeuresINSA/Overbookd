import { Adherent, PayContributionForm } from "@overbookd/contribution";
import { HttpStringified } from "@overbookd/http";
import { Context } from "./context";

export class ContributionRepository {
  private static readonly basePath = "contributions";

  static fetchAdherentsOutToDate(context: Context) {
    return context.$axios.get<HttpStringified<Adherent[]>>(
      `${this.basePath}/out-to-date-adherents`,
    );
  }

  static payContribution(context: Context, form: PayContributionForm) {
    return context.$axios.post<HttpStringified<Adherent>>(this.basePath, form);
  }
}
