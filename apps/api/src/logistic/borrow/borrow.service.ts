import { Injectable } from "@nestjs/common";
import {
  Borrow,
  BorrowError,
  Gear,
  GearRequest,
  InitBorrow,
  InitBorrowForm,
  PlanBorrow,
  PlanBorrowForm,
} from "@overbookd/logistic";

export type Gears = {
  findOne(slug: Gear["slug"]): Promise<Gear>;
};

export type BorrowsForView = {
  findAll(): Promise<Borrow[]>;
  findOne(id: Borrow["id"]): Promise<Borrow>;
};

export type BorrowsForRemove = {
  remove(id: Borrow["id"]): Promise<void>;
};

type UseCases = {
  init: Readonly<InitBorrow>;
  plan: Readonly<PlanBorrow>;
};

type Repositories = {
  views: Readonly<BorrowsForView>;
  removes: Readonly<BorrowsForRemove>;
  gears: Readonly<Gears>;
};

@Injectable()
export class BorrowService {
  constructor(
    private readonly useCases: UseCases,
    private readonly repositories: Repositories,
  ) {}

  async findAll(): Promise<Borrow[]> {
    return this.repositories.views.findAll();
  }

  async findOne(id: Borrow["id"]): Promise<Borrow> {
    return this.repositories.views.findOne(id);
  }

  async initBorrow(form: InitBorrowForm): Promise<Borrow> {
    return this.useCases.init.apply(form);
  }

  async planBorrow(id: Borrow["id"], form: PlanBorrowForm): Promise<Borrow> {
    const lender = form.lender ? { lender: form.lender } : {};
    const availableOn = form.availableOn
      ? { availableOn: form.availableOn }
      : {};
    const unavailableOn = form.unavailableOn
      ? { unavailableOn: form.unavailableOn }
      : {};

    const borrow = {
      ...lender,
      ...availableOn,
      ...unavailableOn,
    };
    return this.useCases.plan.update(id, borrow);
  }

  async removeBorrow(id: Borrow["id"]): Promise<void> {
    return this.repositories.removes.remove(id);
  }

  async addGearRequest(
    id: Borrow["id"],
    slug: GearRequest["slug"],
    quantity: GearRequest["quantity"],
  ): Promise<Borrow> {
    const gear = await this.repositories.gears.findOne(slug);
    if (!gear) throw new BorrowError("Matos introuvable dans le catalogue");
    return this.useCases.plan.addGear(id, { ...gear, quantity });
  }

  async removeGearRequest(
    id: Borrow["id"],
    slug: GearRequest["slug"],
  ): Promise<Borrow> {
    return this.useCases.plan.removeGear(id, slug);
  }
}
