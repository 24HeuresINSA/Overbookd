import type {
  Borrow,
  GearRequest,
  InitBorrowForm,
  PlanBorrowForm,
} from "@overbookd/logistic";
import type { AddGearRequestForm, HttpStringified } from "@overbookd/http";
import { isHttpError } from "~/utils/http/api-fetch";

type State = {
  all: Borrow[];
  selected: Borrow;
};

export const useBorrowStore = defineStore("borrow", {
  state: (): State => ({
    all: [],
    selected: defaultBorrow,
  }),
  actions: {
    async fetchAll() {
      const res = await BorrowRepository.getAll();
      if (isHttpError(res)) return;
      this.all = res.map(castWithDate);
    },

    async fetchOne(id: Borrow["id"]) {
      const res = await BorrowRepository.getOne(id);
      if (isHttpError(res)) return;
      this.selected = castWithDate(res);
    },

    async init(form: InitBorrowForm) {
      const res = await BorrowRepository.init(form);
      if (isHttpError(res)) return;
      this.selected = castWithDate(res);
    },

    async plan(form: PlanBorrowForm) {
      const res = await BorrowRepository.plan(this.selected.id, form);
      if (isHttpError(res)) return;
      this.selected = castWithDate(res);
    },

    async remove(id: Borrow["id"]) {
      const res = await BorrowRepository.remove(id);
      if (isHttpError(res)) return;
      this.selected = defaultBorrow;
      this.fetchAll();
    },

    async addGearRequest(form: AddGearRequestForm) {
      const res = await BorrowRepository.addGearRequest(this.selected.id, form);
      if (isHttpError(res)) return;
      this.selected = castWithDate(res);
    },

    async removeGearRequest(slug: GearRequest["slug"]) {
      const res = await BorrowRepository.removeGearRequest(
        this.selected.id,
        slug,
      );
      if (isHttpError(res)) return;
      this.selected = castWithDate(res);
    },
  },
});

function castWithDate(borrow: HttpStringified<Borrow>) {
  return {
    ...borrow,
    availableOn: new Date(borrow.availableOn),
    unavailableOn: new Date(borrow.unavailableOn),
  };
}

const defaultBorrow: Borrow = {
  id: 0,
  lender: "",
  availableOn: new Date(),
  unavailableOn: new Date(),
  gears: [],
};
