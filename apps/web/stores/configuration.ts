import type { Configuration } from "@overbookd/configuration";
import { updateItemToList } from "@overbookd/list";
import { defaultCommitmentPresentation } from "@overbookd/registration";
import { isSuccess } from "~/utils/http/api-fetch";
import { sendNotification } from "~/utils/notification/send-notification";

type State = {
  configurations: Configuration[];
};

export const useConfigurationStore = defineStore("configuration", {
  state: (): State => ({
    configurations: [],
  }),
  getters: {
    get: (state) => (key: string) => {
      return state.configurations.find((c) => c.key === key)?.value;
    },
    eventStartDate(): Date {
      const eventDate = this.get("eventDate");
      if (!isObject(eventDate) || !("start" in eventDate)) return new Date();
      const start = eventDate.start;
      if (typeof start !== "string") return new Date();
      return new Date(start);
    },
    registerFormDescription(): string {
      const registerForm = this.get("registerForm");
      if (!isObject(registerForm) || !("description" in registerForm)) {
        return defaultCommitmentPresentation;
      }
      const description = registerForm.description;
      if (typeof description !== "string") return defaultCommitmentPresentation;
      return description;
    },
  },
  actions: {
    async fetchAll() {
      const res = await ConfigurationRepository.getAll();
      if (!isSuccess(res)) return;
      this.configurations = res;
    },

    async fetch(key: string) {
      const res = await ConfigurationRepository.fetch(key);
      if (!isSuccess(res)) return;
      this._updateConfig(res);
    },

    async save(config: Configuration) {
      const res = await ConfigurationRepository.save(config);
      if (!isSuccess(res)) return;
      sendNotification("La configuration a été sauvegardée avec succès ✅");
      this._updateConfig(res);
    },

    async _updateConfig(configuration: Configuration) {
      const index = this.configurations.findIndex(
        (c) => c.key === configuration.key,
      );
      const configurations =
        index !== -1
          ? updateItemToList(this.configurations, index, configuration)
          : [...this.configurations, configuration];
      this.configurations = configurations;
    },
  },
});

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && value !== undefined && typeof value === "object";
}
