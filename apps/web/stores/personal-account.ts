import type { HttpStringified } from "@overbookd/http";
import { updateItemToList } from "@overbookd/list";
import type {
  AdjustPrice,
  AdjustOpeningDate,
  ConfiguredBarrel,
  NewBarrel,
} from "@overbookd/personal-account";
import { PersonalAccountRepository } from "~/repositories/personal-account.repository";
import { isHttpError } from "~/utils/http/http-error.utils";

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
      this.barrels = res.map(castBarrelWithDate);
    },

    async removeBarrel(slug: string) {
      const res = await PersonalAccountRepository.removeBarrel(slug);
      if (isHttpError(res)) return;
      sendSuccessNotification("Fût retiré");
      this.barrels = this.barrels.filter((barrel) => barrel.slug !== slug);
    },

    async createBarrel(barrel: NewBarrel) {
      const res = await PersonalAccountRepository.createBarrel(barrel);
      if (isHttpError(res)) return;
      sendSuccessNotification("Fût ajouté");
      const castedBarrel = castBarrelWithDate(res);
      this.barrels = [...this.barrels, castedBarrel];
    },

    async adjustBarrelPrice({ slug, price }: AdjustPrice) {
      const res = await PersonalAccountRepository.adjustBarrelPrice(
        slug,
        price,
      );
      if (isHttpError(res)) return;
      sendSuccessNotification("Prix du fût ajusté");
      this._updateBarrel(castBarrelWithDate(res));
    },

    async adjustBarrelOpeningDate({ slug, openedOn }: AdjustOpeningDate) {
      const res = await PersonalAccountRepository.adjustBarrelOpeningDate(
        slug,
        openedOn,
      );
      if (isHttpError(res)) return;
      sendSuccessNotification("Date d'ouverture du fût ajustée");
      this._updateBarrel(castBarrelWithDate(res));
    },

    _updateBarrel(barrel: ConfiguredBarrel) {
      const index = this.barrels.findIndex(({ slug }) => slug === barrel.slug);
      if (index === -1) return;
      this.barrels = updateItemToList(this.barrels, index, barrel);
    },
  },
});

function castBarrelWithDate(
  barrel: HttpStringified<ConfiguredBarrel>,
): ConfiguredBarrel {
  return {
    ...barrel,
    openedOn: new Date(barrel.openedOn),
  };
}
