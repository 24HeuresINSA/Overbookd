import {
  canReadConfiguration,
  EVENT_DATE_KEY,
  ORGA_WEEK_DATE_KEY,
  REGISTRATION_FORM_KEY,
  USEFUL_LINKS_KEY,
  type Configuration,
} from "@overbookd/configuration";
import { updateItemToList } from "@overbookd/list";
import {
  defaultVolunteerCommitmentPresentation,
  defaultStaffCommitmentPresentation,
} from "@overbookd/registration";
import { Duration, OverDate, type IProvidePeriod } from "@overbookd/time";
import { ConfigurationRepository } from "~/repositories/configuration.repository";
import { isHttpError } from "~/utils/http/http-error.utils";

type RegistrationFormValue = {
  volunteerDescription: string;
  staffDescription: string;
};

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

    mondayBeforeEventDate(): Date {
      const duration = Duration.ONE_DAY.times(4);
      return OverDate.from(this.eventStartDate).minus(duration).date;
    },

    orgaWeekStartDate(): Date | null {
      const orgaWeekDate = this.get(ORGA_WEEK_DATE_KEY);
      if (!isObject(orgaWeekDate) || !("start" in orgaWeekDate)) return null;
      const start = orgaWeekDate.start;
      if (typeof start !== "string") return null;
      return OverDate.fromLocal(new Date(start)).date;
    },

    registrationForm(): RegistrationFormValue {
      const registrationForm = this.get(REGISTRATION_FORM_KEY);
      const defaultValue: RegistrationFormValue = {
        volunteerDescription: defaultVolunteerCommitmentPresentation,
        staffDescription: defaultStaffCommitmentPresentation,
      };
      if (!isObject(registrationForm)) return defaultValue;

      const volunteerDescription = registrationForm.volunteerDescription;
      const staffDescription = registrationForm.staffDescription;
      return {
        volunteerDescription:
          typeof volunteerDescription !== "string"
            ? defaultVolunteerCommitmentPresentation
            : (volunteerDescription as string),
        staffDescription:
          typeof staffDescription !== "string"
            ? defaultStaffCommitmentPresentation
            : (staffDescription as string),
      };
    },

    usefulLinks(): { googleCalendar?: string; slack?: string } {
      const links = this.get(USEFUL_LINKS_KEY);
      if (!isObject(links)) return {};
      return {
        googleCalendar: toOptionalString(links.googleCalendar),
        slack: toOptionalString(links.slack),
      };
    },
  },
  actions: {
    async fetchAll() {
      const res = await ConfigurationRepository.getAll();
      if (isHttpError(res)) return;
      this.configurations = res;
    },

    async fetch(key: string) {
      const shouldBeAuthenticated = !canReadConfiguration(key, []);
      const res = shouldBeAuthenticated
        ? await ConfigurationRepository.fetch(key)
        : await ConfigurationRepository.fetchAsUnauthenticated(key);
      if (isHttpError(res)) return;
      this._updateConfig(res);
    },

    async save(config: Configuration) {
      const res = await ConfigurationRepository.save(config);
      if (isHttpError(res)) return;
      sendSuccessNotification("La configuration a été sauvegardée");
      this._updateConfig(res);
    },

    async saveBriefingTimeWindow(period: IProvidePeriod) {
      const res = await ConfigurationRepository.saveBriefingTimeWindow(period);
      if (isHttpError(res)) return;
      sendSuccessNotification("Le créneau du brief a été sauvegardé");
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

function toOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined;
}
