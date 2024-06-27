import { Period } from "@overbookd/period";
import {
  Availabilities,
  type InitOverDate,
} from "@overbookd/volunteer-availability";
import { VolunteerAvailabilityRepository } from "~/repositories/volunteer-availability.repository";
import { isHttpError } from "~/utils/http/api-fetch";
import { castPeriodsWithDate } from "~/utils/http/period";
import { sendNotification } from "~/utils/notification/send-notification";

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
        this.currentCharisma = userStore.me.charisma;

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
        sendNotification("Disponibilitiés sauvegardées 🥳");
        this._initAvailabilities(castPeriodsWithDate(res));

        const userStore = useUserStore();
        userStore.fetchMyInformation();
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
        sendNotification("Disponibilitiés sauvegardées 🥳");
        this._initAvailabilities(castPeriodsWithDate(res));
      },

      selectAvailability(date: InitOverDate, charisma: number) {
        this.availabilities = this.availabilities.select(date);
        this.currentCharisma = this.currentCharisma + charisma;
      },

      unSelectAvailability(date: InitOverDate, charisma: number) {
        this.availabilities = this.availabilities.unselect(date);
        this.currentCharisma = this.currentCharisma - charisma;
      },

      removeRecordedAvailability(date: InitOverDate, charisma: number) {
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
