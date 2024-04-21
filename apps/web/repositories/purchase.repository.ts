import { AddGearRequestForm, HttpStringified } from "@overbookd/http";
import {
  Purchase,
  InitPurchaseForm,
  GearRequest,
  PlanPurchaseForm,
} from "@overbookd/logistic";
import { Context } from "./context";

export class PurchaseRepository {
  private static readonly basePath = "logistic/purchases";

  static getAll(context: Context) {
    return context.$axios.get<HttpStringified<Purchase[]>>(this.basePath);
  }

  static getOne(context: Context, id: Purchase["id"]) {
    return context.$axios.get<HttpStringified<Purchase>>(
      `${this.basePath}/${id}`,
    );
  }

  static init(context: Context, form: InitPurchaseForm) {
    return context.$axios.post<HttpStringified<Purchase>>(this.basePath, form);
  }

  static plan(context: Context, id: Purchase["id"], form: PlanPurchaseForm) {
    return context.$axios.patch<HttpStringified<Purchase>>(
      `${this.basePath}/${id}`,
      form,
    );
  }

  static remove(context: Context, id: Purchase["id"]) {
    return context.$axios.delete<HttpStringified<Purchase>>(
      `${this.basePath}/${id}`,
    );
  }

  static addGearRequest(
    context: Context,
    id: Purchase["id"],
    form: AddGearRequestForm,
  ) {
    return context.$axios.post<HttpStringified<Purchase>>(
      `${this.basePath}/${id}/gear-requests`,
      form,
    );
  }

  static removeGearRequest(
    context: Context,
    id: Purchase["id"],
    slug: GearRequest["slug"],
  ) {
    return context.$axios.delete<HttpStringified<Purchase>>(
      `${this.basePath}/${id}/gear-requests/${slug}`,
    );
  }
}
