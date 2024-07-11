import type { Signage, SignageForm, SignageUpdateForm } from "@overbookd/signa";
import { CatalogSignageRepository } from "~/repositories/logistic/catalog-signage.repository";
import { updateItemToList } from "@overbookd/list";
import type { SignageWithPotentialImage } from "~/utils/logistic/signage";
import { isHttpError } from "~/utils/http/api-fetch";

type State = {
  signages: SignageWithPotentialImage[];
  signage: SignageWithPotentialImage | null;
};

export const useCatalogSignageStore = defineStore("catalog-signage", {
  state: (): State => ({
    signages: [],
    signage: null,
  }),
  actions: {
    async fetchSignages() {
      const res = await CatalogSignageRepository.fetchSignages();
      if (isHttpError(res)) return;
      this.signages = res;
    },

    async fetchSignageImage(signage: Signage) {
      const res = await CatalogSignageRepository.getSignageImage(signage.id);
      if (isHttpError(res)) return;
      const signageWithImage = { ...signage, imageBlob: res };
      this._updateSignage(signageWithImage);
    },

    async createSignage(signageForm: SignageForm) {
      const res = await CatalogSignageRepository.createSignage(signageForm);
      if (isHttpError(res)) return;
      sendSuccessNotification("La signalétique a été créé avec succès ✅");
      this.signages = [...this.signages, res];
      this.signage = res;
    },

    async updateSignage(form: SignageUpdateForm) {
      const { id, ...signageForm } = form;
      const res = await CatalogSignageRepository.updateSignage(id, signageForm);
      if (isHttpError(res)) return;
      sendSuccessNotification(
        "La signalétique a été mis a jour avec succès ✅",
      );
      this._updateSignage(res);
    },

    async deleteSignage(signage: Signage) {
      const res = await CatalogSignageRepository.deleteSignage(signage.id);
      if (isHttpError(res)) return;
      sendSuccessNotification("La signalétique a été supprimé avec succès ✅");
      this.signages = this.signages.filter((s) => s.id !== signage.id);
    },

    async uploadSignageImage(signageId: number, signageImage: FormData) {
      const res = await CatalogSignageRepository.uploadSignageImage(
        signageId,
        signageImage,
      );
      if (isHttpError(res)) return;
      sendSuccessNotification(
        "Image de la signalétique mise à jour avec succès ✅",
      );

      const imageBlob =
        await CatalogSignageRepository.getSignageImage(signageId);
      if (isHttpError(imageBlob)) return;
      this._updateSignage({ ...res, imageBlob });
    },

    _updateSignage(signage: SignageWithPotentialImage) {
      const index = this.signages.findIndex((s) => s.id === signage.id);
      if (index === -1) return;
      this.signages = updateItemToList(this.signages, index, signage);
      this.signage = signage;
    },
  },
});
