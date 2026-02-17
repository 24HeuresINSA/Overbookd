import {
  EVENT_DATE_KEY,
  ORGA_WEEK_DATE_KEY,
  REGISTER_FORM_KEY,
  type Configuration,
} from "@overbookd/configuration";
import { updateItemToList } from "@overbookd/list";
import { defaultCommitmentPresentation } from "@overbookd/registration";
import { OverDate } from "@overbookd/time";
import { ConfigurationRepository } from "~/repositories/configuration.repository";
import { isHttpError } from "~/utils/http/http-error.utils";

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
      const eventDate = this.get(EVENT_DATE_KEY);
      const now = OverDate.now().date;
      if (!isObject(eventDate) || !("start" in eventDate)) return now;
      const start = eventDate.start;
      if (typeof start !== "string") return now;
      return OverDate.fromLocal(new Date(start)).date;
    },

    orgaWeekStartDate(): Date {
      const orgaWeekDate = this.get(ORGA_WEEK_DATE_KEY);
      const now = OverDate.now().date;
      if (!isObject(orgaWeekDate) || !("start" in orgaWeekDate)) return now;
      const start = orgaWeekDate.start;
      if (typeof start !== "string") return now;
      return OverDate.fromLocal(new Date(start)).date;
    },

    registerFormDescription(): string {
      const registerForm = this.get(REGISTER_FORM_KEY);
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
      if (isHttpError(res)) return;
      this.configurations = res;
    },

    async fetch(key: string) {
      const res = await ConfigurationRepository.fetch(key);
      if (isHttpError(res)) return;
      this._updateConfig(res);
    },

    async save(config: Configuration) {
      const res = await ConfigurationRepository.save(config);
      if (isHttpError(res)) return;
      sendSuccessNotification("La configuration a été sauvegardée");
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
