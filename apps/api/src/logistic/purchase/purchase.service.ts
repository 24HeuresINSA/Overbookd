import { Injectable, NotFoundException } from "@nestjs/common";
import {
  CancelPurchase,
  GearRequest,
  InitPurchase,
  InitPurchaseForm,
  LogisticError,
  PlanPurchase,
  PlanPurchaseForm,
  Purchase,
} from "@overbookd/logistic";
import { FindGears } from "../common/repositories/find-gears.prisma";

export type PurchasesForView = {
  findAll(): Promise<Purchase[]>;
  findOne(id: Purchase["id"]): Promise<Purchase | undefined>;
};

type Repositories = {
  views: Readonly<PurchasesForView>;
  gears: Readonly<FindGears>;
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

  findAll(): Promise<Purchase[]> {
    return this.repositories.views.findAll();
  }

  async findOne(id: Purchase["id"]): Promise<Purchase> {
    const purchase = await this.repositories.views.findOne(id);
    if (!purchase) throw new NotFoundException(`Achat ${id} introuvable`);
    return purchase;
  }

  initPurchase(form: InitPurchaseForm): Promise<Purchase> {
    return this.useCases.init.apply(form);
  }

  planPurchase(id: Purchase["id"], form: PlanPurchaseForm): Promise<Purchase> {
    const seller = form.seller ? { seller: form.seller } : {};
    const availableOn = form.availableOn
      ? { availableOn: form.availableOn }
      : {};

    const purchase = { ...seller, ...availableOn };
    return this.useCases.plan.update(id, purchase);
  }

  cancelPurchase(id: Purchase["id"]): Promise<void> {
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

  removeGear(id: Purchase["id"], slug: GearRequest["slug"]): Promise<Purchase> {
    return this.useCases.plan.removeGear(id, slug);
  }
}
