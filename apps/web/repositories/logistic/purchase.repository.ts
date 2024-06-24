import type { AddGearRequestForm } from "@overbookd/http";
import type {
  GearRequest,
  InitPurchaseForm,
  PlanPurchaseForm,
  Purchase,
} from "@overbookd/logistic";
import { HttpClient } from "~/utils/http/http-client";

export class PurchaseRepository {
  private static readonly basePath = "logistic/purchases";

  static getAll() {
    return HttpClient.get<Purchase[]>(this.basePath);
  }

  static getOne(id: Purchase["id"]) {
    return HttpClient.get<Purchase>(`${this.basePath}/${id}`);
  }

  static init(form: InitPurchaseForm) {
    return HttpClient.post<Purchase>(this.basePath, form);
  }

  static plan(id: Purchase["id"], form: PlanPurchaseForm) {
    return HttpClient.patch<Purchase>(`${this.basePath}/${id}`, form);
  }

  static remove(id: Purchase["id"]) {
    return HttpClient.delete<Purchase>(`${this.basePath}/${id}`);
  }

  static addGearRequest(id: Purchase["id"], form: AddGearRequestForm) {
    return HttpClient.post<Purchase>(
      `${this.basePath}/${id}/gear-requests`,
      form,
    );
  }

  static removeGearRequest(id: Purchase["id"], slug: GearRequest["slug"]) {
    return HttpClient.delete<Purchase>(
      `${this.basePath}/${id}/gear-requests/${slug}`,
    );
  }
}
