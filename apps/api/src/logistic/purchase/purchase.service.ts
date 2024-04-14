import { Injectable } from "@nestjs/common";
import {
  CancelPurchase,
  Gear,
  GearRequest,
  InitPurchase,
  InitPurchaseForm,
  LogisticError,
  PlanPurchase,
  PlanPurchaseForm,
  Purchase,
} from "@overbookd/logistic";

export type Gears = {
  findOne(slug: Gear["slug"]): Promise<Gear>;
};

export type PurchasesForView = {
  findAll(): Promise<Purchase[]>;
  findOne(id: Purchase["id"]): Promise<Purchase>;
};

type Repositories = {
  views: Readonly<PurchasesForView>;
  gears: Readonly<Gears>;
};

type UseCases = {
  init: Readonly<InitPurchase>;
  plan: Readonly<PlanPurchase>;
  cancel: Readonly<CancelPurchase>;
};

@Injectable()
export class PurchaseService {
  constructor(
    private readonly useCases: UseCases,
    private readonly repositories: Repositories,
  ) {}

  async findAll(): Promise<Purchase[]> {
    return this.repositories.views.findAll();
  }

  async findOne(id: Purchase["id"]): Promise<Purchase> {
    return this.repositories.views.findOne(id);
  }

  async initPurchase(form: InitPurchaseForm): Promise<Purchase> {
    return this.useCases.init.apply(form);
  }

  async planPurchase(
    id: Purchase["id"],
    form: PlanPurchaseForm,
  ): Promise<Purchase> {
    const seller = form.seller ? { seller: form.seller } : {};
    const availableOn = form.availableOn
      ? { availableOn: form.availableOn }
      : {};

    const purchase = { ...seller, ...availableOn };

    return this.useCases.plan.update(id, purchase);
  }

  async cancelPurchase(id: Purchase["id"]): Promise<void> {
    return this.useCases.cancel.apply(id);
  }

  async addGear(
    id: Purchase["id"],
    slug: GearRequest["slug"],
    quantity: GearRequest["quantity"],
  ): Promise<Purchase> {
    const gear = await this.repositories.gears.findOne(slug);
    if (!gear) throw new LogisticError("Matos introuvable dans le catalogue");
    return this.useCases.plan.addGear(id, { ...gear, quantity });
  }

  async removeGear(
    id: Purchase["id"],
    slug: GearRequest["slug"],
  ): Promise<Purchase> {
    return this.useCases.plan.removeGear(id, slug);
  }
}
