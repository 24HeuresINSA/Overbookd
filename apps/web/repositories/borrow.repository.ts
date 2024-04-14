import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { AddGearRequestForm, HttpStringified } from "@overbookd/http";
import {
  Borrow,
  GearRequest,
  InitBorrowForm,
  PlanBorrowForm,
} from "@overbookd/logistic";

export type Context = { $axios: NuxtAxiosInstance };

export class BorrowRepository {
  private static readonly basePath = "logistic/borrows";

  static getAll(context: Context) {
    return context.$axios.get<HttpStringified<Borrow[]>>(this.basePath);
  }

  static getOne(context: Context, id: Borrow["id"]) {
    return context.$axios.get<HttpStringified<Borrow>>(
      `${this.basePath}/${id}`,
    );
  }

  static init(context: Context, form: InitBorrowForm) {
    return context.$axios.post<HttpStringified<Borrow>>(this.basePath, form);
  }

  static plan(context: Context, id: Borrow["id"], form: PlanBorrowForm) {
    return context.$axios.patch<HttpStringified<Borrow>>(
      `${this.basePath}/${id}`,
      form,
    );
  }

  static remove(context: Context, id: Borrow["id"]) {
    return context.$axios.delete<HttpStringified<Borrow>>(
      `${this.basePath}/${id}`,
    );
  }

  static addGearRequest(
    context: Context,
    id: Borrow["id"],
    form: AddGearRequestForm,
  ) {
    return context.$axios.post<HttpStringified<Borrow>>(
      `${this.basePath}/${id}/gear-requests`,
      form,
    );
  }

  static removeGearRequest(
    context: Context,
    id: Borrow["id"],
    slug: GearRequest["slug"],
  ) {
    return context.$axios.delete<HttpStringified<Borrow>>(
      `${this.basePath}/${id}/gear-requests/${slug}`,
    );
  }
}
