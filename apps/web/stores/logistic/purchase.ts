import type { AddGearRequestForm, HttpStringified } from "@overbookd/http";
import type {
  GearRequest,
  InitPurchaseForm,
  PlanPurchaseForm,
  Purchase,
} from "@overbookd/logistic";
import { PurchaseRepository } from "~/repositories/logistic/purchase.repository";
import { isHttpError } from "~/utils/http/http-error.utils";

type State = {
  all: Purchase[];
  selected: Purchase;
};

export const usePurchaseStore = defineStore("purchase", {
  state: (): State => ({
    all: [],
    selected: defaultPurchase,
  }),
  actions: {
    async fetchAll() {
      const res = await PurchaseRepository.getAll();
      if (isHttpError(res)) return;
      this.all = res.map(castWithDate);
    },

    async fetchOne(id: Purchase["id"]) {
      const res = await PurchaseRepository.getOne(id);
      if (isHttpError(res)) return;
      this.selected = castWithDate(res);
    },

    async init(form: InitPurchaseForm) {
      const res = await PurchaseRepository.init(form);
      if (isHttpError(res)) return;
      this.selected = castWithDate(res);
    },

    async plan(form: PlanPurchaseForm) {
      const res = await PurchaseRepository.plan(this.selected.id, form);
      if (isHttpError(res)) return;
      this.selected = castWithDate(res);
    },

    async remove(id: Purchase["id"]) {
      const res = await PurchaseRepository.remove(id);
      if (isHttpError(res)) return;
      sendSuccessNotification("Fiche achat supprimée");
      this.selected = defaultPurchase;
      this.fetchAll();
    },

    async addGearRequest(form: AddGearRequestForm) {
      const res = await PurchaseRepository.addGearRequest(
        this.selected.id,
        form,
      );
      if (isHttpError(res)) return;
      sendSuccessNotification("Matos ajouté");
      this.selected = castWithDate(res);
    },

    async removeGearRequest(slug: GearRequest["slug"]) {
      const res = await PurchaseRepository.removeGearRequest(
        this.selected.id,
        slug,
      );
      if (isHttpError(res)) return;
      sendSuccessNotification("Matos supprimé");
      this.selected = castWithDate(res);
    },
  },
});

function castWithDate(purchase: HttpStringified<Purchase>) {
  return {
    ...purchase,
    availableOn: new Date(purchase.availableOn),
  };
}

const defaultPurchase: Purchase = {
  id: 0,
  seller: "",
  availableOn: new Date(),
  gears: [],
};
