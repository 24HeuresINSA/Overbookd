import type {
  CharismaPeriod,
  HttpStringified,
  SavedCharismaPeriod,
} from "@overbookd/http";
import { updateItemToList } from "@overbookd/list";
import { isHttpError } from "~/utils/http/api-fetch";
import { castPeriodWithDate } from "~/utils/http/period";

type State = {
  charismaPeriods: SavedCharismaPeriod[];
};

export const useCharismaPeriodStore = defineStore("charisma-period", {
  state: (): State => ({
    charismaPeriods: [],
  }),
  actions: {
    async fetchCharismaPeriods() {
      const res = await CharismaPeriodRepository.getCharismaPeriods();
      if (isHttpError(res)) return;
      this.charismaPeriods = res.map(castCharismaPeriodWithDate);
    },

    async addCharismaPeriod(charismaPeriod: CharismaPeriod) {
      const res =
        await CharismaPeriodRepository.createCharismaPeriod(charismaPeriod);
      if (isHttpError(res)) return;
      sendSuccessNotification("Période ajoutée");

      const newPeriod = castCharismaPeriodWithDate(res);
      this.charismaPeriods = [...this.charismaPeriods, newPeriod];
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
      const index = this.charismaPeriods.findIndex((cp) => cp.id === id);
      this.charismaPeriods = updateItemToList(
        this.charismaPeriods,
        index,
        updatedPeriod,
      );
    },

    async deleteCharismaPeriod({ id }: SavedCharismaPeriod) {
      const res = await CharismaPeriodRepository.deleteCharismaPeriod(id);
      if (isHttpError(res)) return;
      sendSuccessNotification("Période supprimée");
      this.charismaPeriods = this.charismaPeriods.filter((cp) => cp.id !== id);
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
