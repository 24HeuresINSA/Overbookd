import type {
  CharismaPeriod,
  HttpStringified,
  SavedCharismaPeriod,
} from "@overbookd/http";
import { updateItemToList } from "@overbookd/list";
import { CharismaPeriodRepository } from "~/repositories/charisma/charisma-period.repository";
import { isHttpError } from "~/utils/http/http-error.utils";
import { castPeriodWithDate } from "~/utils/http/period";

type State = {
  all: SavedCharismaPeriod[];
};

export const useCharismaPeriodStore = defineStore("charisma-period", {
  state: (): State => ({
    all: [],
  }),
  actions: {
    async fetchCharismaPeriods() {
      const res = await CharismaPeriodRepository.getCharismaPeriods();
      if (isHttpError(res)) return;
      this.all = res.map(castCharismaPeriodWithDate);
    },

    async addCharismaPeriod(charismaPeriod: CharismaPeriod) {
      const res =
        await CharismaPeriodRepository.createCharismaPeriod(charismaPeriod);
      if (isHttpError(res)) return;
      sendSuccessNotification("Période ajoutée");

      const newPeriod = castCharismaPeriodWithDate(res);
      this.all = [...this.all, newPeriod];
    },

    async updateCharismaPeriod(charismaPeriod: SavedCharismaPeriod) {
      const { id, ...charismaPeriodWithoutId } = charismaPeriod;
      const res = await CharismaPeriodRepository.updateCharismaPeriod(
        id,
        charismaPeriodWithoutId,
      );
      if (isHttpError(res)) return;
      sendSuccessNotification("Période modifiée");

      const updatedPeriod = castCharismaPeriodWithDate(res);
      const index = this.all.findIndex((cp) => cp.id === id);
      this.all = updateItemToList(this.all, index, updatedPeriod);
    },

    async deleteCharismaPeriod({ id }: SavedCharismaPeriod) {
      const res = await CharismaPeriodRepository.deleteCharismaPeriod(id);
      if (isHttpError(res)) return;
      sendSuccessNotification("Période supprimée");
      this.all = this.all.filter((cp) => cp.id !== id);
    },
  },
});

function castCharismaPeriodWithDate(
  charismaPeriod: HttpStringified<SavedCharismaPeriod>,
): SavedCharismaPeriod {
  return {
    ...charismaPeriod,
    ...castPeriodWithDate(charismaPeriod),
  };
}
