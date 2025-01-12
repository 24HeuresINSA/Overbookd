import { OverDate, Period } from "@overbookd/time";
import { Availabilities } from "@overbookd/volunteer-availability";
import { VolunteerAvailabilityRepository } from "~/repositories/volunteer-availability.repository";
import { isHttpError } from "~/utils/http/http-error.utils";
import { castPeriodsWithDate } from "~/utils/http/cast-date/period.utils";

const repo = VolunteerAvailabilityRepository;

type State = {
  availabilities: Availabilities;
  currentCharisma: number;
};

export const useVolunteerAvailabilityStore = defineStore(
  "volunteer-availability",
  {
    state: (): State => ({
      availabilities: Availabilities.init(),
      currentCharisma: 0,
    }),
    actions: {
      clearVolunteerAvailabilities() {
        this._initAvailabilities([]);
        this.currentCharisma = 0;
      },

      async fetchVolunteerAvailabilities(userId: number) {
        const userStore = useUserStore();
        this.currentCharisma = userStore.loggedUser?.charisma ?? 0;

        const res = await repo.getVolunteerAvailabilities(userId);
        if (isHttpError(res)) return;
        this._initAvailabilities(castPeriodsWithDate(res));
      },

      async updateVolunteerAvailabilities(userId: number) {
        const res = await repo.updateVolunteerAvailabilities(
          userId,
          this.availabilities.list,
        );
        if (isHttpError(res)) return;
        sendSuccessNotification("Disponibilitiés sauvegardées 🥳");
        this._initAvailabilities(castPeriodsWithDate(res));

        const userStore = useUserStore();
        userStore.fetchMyInformations();
      },

      async overrideVolunteerAvailabilities(
        volunteerId: number,
        availabilities: Period[],
      ) {
        const res = await repo.overrideVolunteerAvailabilities(
          volunteerId,
          availabilities,
        );
        if (isHttpError(res)) return;
        sendSuccessNotification("Disponibilitiés sauvegardées 🥳");
        this._initAvailabilities(castPeriodsWithDate(res));
      },

      selectAvailability(date: OverDate, charisma: number) {
        this.availabilities = this.availabilities.select(date);
        this.currentCharisma = this.currentCharisma + charisma;
      },

      unSelectAvailability(date: OverDate, charisma: number) {
        this.availabilities = this.availabilities.unselect(date);
        this.currentCharisma = this.currentCharisma - charisma;
      },

      removeRecordedAvailability(date: OverDate, charisma: number) {
        const all = this.availabilities.list as Period[];
        this.availabilities = Availabilities.init({ selected: all });
        this.availabilities = this.availabilities.unselect(date);
        this.currentCharisma = this.currentCharisma - charisma;
      },

      _initAvailabilities(recorded: Period[]) {
        this.availabilities = Availabilities.init({ recorded });
      },
    },
  },
);
