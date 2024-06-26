import type { Gears } from "~/domain/inventory/gears";
import { InMemoryGears } from "~/domain/inventory/gears.inmemory";
import type {
  CatalogGear,
  CatalogGearForm,
  GearSearchOptions,
} from "@overbookd/http";
import { GearsRepository } from "~/repositories/logistic/catalog.repository";
import { isHttpError } from "~/utils/http/api-fetch";
import { sendNotification } from "~/utils/notification/send-notification";

type State = {
  gears: CatalogGear[];
};

export const useCatalogGearStore = defineStore("catalog-gear", {
  state: (): State => ({
    gears: [],
  }),
  getters: {
    gearRepository(state): Gears {
      return new InMemoryGears(state.gears);
    },
  },
  actions: {
    async fetchGears(gearSearchOptions: GearSearchOptions): Promise<void> {
      const res = await GearsRepository.searchGears(gearSearchOptions);
      if (isHttpError(res)) return;
      this.gears = res;
    },

    async createGear(gearForm: CatalogGearForm): Promise<void> {
      const res = await GearsRepository.createGear(gearForm);
      if (isHttpError(res)) return;
      sendNotification(`Le matériel ${res.name} a été créé ✅`);
      this.gears = [...this.gears, res];
    },

    async updateGear(gearId: number, gearForm: CatalogGearForm): Promise<void> {
      const res = await GearsRepository.updateGear(gearId, gearForm);
      if (isHttpError(res)) return;
      sendNotification(`Le matériel ${res.name} a été mis à jour ✅`);
      this.gears = this.gears.map((gear) => (gear.id === res.id ? res : gear));
    },

    async deleteGear(gear: CatalogGear): Promise<void> {
      const res = await GearsRepository.deleteGear(gear.id);
      if (isHttpError(res)) return;
      sendNotification(`Le matériel ${gear.name} a été supprimé ✅`);
      this.gears = this.gears.filter((g) => g.id !== gear.id);
    },
  },
});
