import { updateItemToList } from "@overbookd/list";
import type {
  AdjustPrice,
  ConfiguredBarrel,
  NewBarrel,
} from "@overbookd/personal-account";
import { PersonalAccountRepository } from "~/repositories/personal-account.repository";
import { isHttpError } from "~/utils/http/api-fetch";

type State = {
  barrels: ConfiguredBarrel[];
};

export const usePersonalAccountStore = defineStore("personal-account", {
  state: (): State => ({
    barrels: [],
  }),
  actions: {
    async fetchBarrels() {
      const res = await PersonalAccountRepository.getBarrels();
      if (isHttpError(res)) return;
      this.barrels = res;
    },

    async removeBarrel(slug: string) {
      const res = await PersonalAccountRepository.removeBarrelPrice(slug);
      if (isHttpError(res)) return;
      sendSuccessNotification("Fût retiré ✅");
      this.barrels = this.barrels.filter((barrel) => barrel.slug !== slug);
    },

    async createBarrel(barrel: NewBarrel) {
      const res = await PersonalAccountRepository.createBarrel(barrel);
      if (isHttpError(res)) return;
      sendSuccessNotification("Fût ajouté ✅");
      this.barrels = [...this.barrels, res];
    },

    async adjustBarrelPrice({ slug, price }: AdjustPrice) {
      const res = await PersonalAccountRepository.adjustBarrelPrice(
        slug,
        price,
      );
      if (isHttpError(res)) return;
      sendSuccessNotification("Prix du fût ajusté ✅");
      const index = this.barrels.findIndex(({ slug }) => slug === res.slug);
      if (index === -1) return;
      this.barrels = updateItemToList(this.barrels, index, res);
    },
  },
});
