import type { SignaLocation } from "@overbookd/signa";
import { LocationRepository } from "~/repositories/location.repository";
import type { CreateLocation } from "@overbookd/http";
import { isHttpError } from "~/utils/http/api-fetch";

type State = {
  all: SignaLocation[];
};

export const useLocationStore = defineStore("location", {
  state: (): State => ({
    all: [],
  }),
  getters: {
    getLocationById: (state) => (id: number) => {
      return state.all.find((location) => location.id === id);
    },
  },
  actions: {
    async fetchAllLocations() {
      const res = await LocationRepository.getAllLocations();
      if (isHttpError(res)) return;
      this.all = res;
    },

    async createLocation(location: CreateLocation) {
      const res = await LocationRepository.createNewLocation(location);
      if (isHttpError(res)) return;
      sendSuccessNotification("Lieu ajouté 🥳");
      await this.fetchAllLocations();
    },

    async editLocation(location: SignaLocation) {
      const res = await LocationRepository.updateLocation(location);
      if (!isHttpError(res)) return;
      sendSuccessNotification("Lieu modifié 🥳");
      await this.fetchAllLocations();
    },

    async deleteLocation(location: SignaLocation) {
      const res = await LocationRepository.deleteLocation(location.id);
      if (isHttpError(res)) return;
      sendSuccessNotification("Lieu supprimé 🥳");
      await this.fetchAllLocations();
    },
  },
});
