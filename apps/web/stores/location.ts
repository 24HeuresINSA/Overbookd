import type { SignaLocation } from "@overbookd/signa";
import { LocationRepository } from "~/repositories/location.repository";
import type { CreateLocation } from "@overbookd/http";
import { isHttpError } from "~/utils/http/api-fetch";
import { sendNotification } from "~/utils/notification/send-notification";

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
    async getAllLocations() {
      const res = await LocationRepository.getAllLocations();
      if (isHttpError(res)) return;
      this.all = res;
    },

    async createLocation(location: CreateLocation) {
      const res = await LocationRepository.createNewLocation(location);
      if (isHttpError(res)) return;
      sendNotification("Lieu ajouté 🥳");
      await this.getAllLocations();
    },

    async editLocation(location: SignaLocation) {
      const res = await LocationRepository.updateLocation(location);
      if (!isHttpError(res)) return;
      sendNotification("Lieu modifié 🥳");
      await this.getAllLocations();
    },

    async deleteLocation(location: SignaLocation) {
      const res = await LocationRepository.deleteLocation(location.id);
      if (isHttpError(res)) return;
      sendNotification("Lieu supprimé 🥳");
      await this.getAllLocations();
    },
  },
});
