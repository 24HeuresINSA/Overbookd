import type { AddGearRequestForm } from "@overbookd/http";
import type {
  Borrow,
  GearRequest,
  InitBorrowForm,
  PlanBorrowForm,
} from "@overbookd/logistic";
import { HttpClient } from "~/utils/http/http-client";

export class BorrowRepository {
  private static readonly basePath = "logistic/borrows";

  static getAll() {
    return HttpClient.get<Borrow[]>(this.basePath);
  }

  static getOne(id: Borrow["id"]) {
    return HttpClient.get<Borrow>(`${this.basePath}/${id}`);
  }

  static init(form: InitBorrowForm) {
    return HttpClient.post<Borrow>(this.basePath, form);
  }

  static plan(id: Borrow["id"], form: PlanBorrowForm) {
    return HttpClient.patch<Borrow>(`${this.basePath}/${id}`, form);
  }

  static remove(id: Borrow["id"]) {
    return HttpClient.delete<Borrow>(`${this.basePath}/${id}`);
  }

  static addGearRequest(id: Borrow["id"], form: AddGearRequestForm) {
    return HttpClient.post<Borrow>(
      `${this.basePath}/${id}/gear-requests`,
      form,
    );
  }

  static removeGearRequest(id: Borrow["id"], slug: GearRequest["slug"]) {
    return HttpClient.delete<Borrow>(
      `${this.basePath}/${id}/gear-requests/${slug}`,
    );
  }
}
