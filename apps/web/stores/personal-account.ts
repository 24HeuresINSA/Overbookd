import { updateItemToList } from "@overbookd/list";
import type {
  AdjustPrice,
  ConfiguredBarrel,
  NewBarrel,
} from "@overbookd/personal-account";
import { PersonalAccountRepository } from "~/repositories/personal-account.repository";
import { isSuccess } from "~/utils/http/api-fetch";
import { sendNotification } from "~/utils/notification/send-notification";

type State = {
  barrels: ConfiguredBarrel[];
};

export const usePersonalAccountStore = defineStore("personalAccount", {
  state: (): State => ({
    barrels: [],
  }),
  actions: {
    async fetchBarrels() {
      const res = await PersonalAccountRepository.getBarrels();
      if (!isSuccess(res)) return;
      this.barrels = res;
    },

    async removeBarrel(slug: string) {
      const res = await PersonalAccountRepository.removeBarrelPrice(slug);
      if (!isSuccess(res)) return;
      sendNotification("Fût retiré");
      this.barrels = this.barrels.filter((barrel) => barrel.slug !== slug);
    },

    async createBarrel(barrel: NewBarrel) {
      const res = await PersonalAccountRepository.createBarrel(barrel);
      if (!isSuccess(res)) return;
      sendNotification("Fût ajouté");
      this.barrels = [...this.barrels, res];
    },

    async adjustBarrelPrice({ slug, price }: AdjustPrice) {
      const res = await PersonalAccountRepository.adjustBarrelPrice(
        slug,
        price,
      );
      if (!isSuccess(res)) return;
      sendNotification("Prix du fût ajusté");
      const index = this.barrels.findIndex(({ slug }) => slug === res.slug);
      if (index === -1) return;
      this.barrels = updateItemToList(this.barrels, index, res);
    },
  },
});
