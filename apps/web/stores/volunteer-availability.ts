import { OverDate, Period } from "@overbookd/time";
import type { HttpStringified, OverClicScore } from "@overbookd/http";
import { Availabilities } from "@overbookd/volunteer-availability";
import { VolunteerAvailabilityRepository } from "~/repositories/volunteer-availability.repository";
import { isHttpError } from "~/utils/http/http-error.utils";
import { castPeriodsWithDate } from "~/utils/http/cast-date/period.utils";

const repo = VolunteerAvailabilityRepository;

type State = {
  availabilities: Availabilities;
  currentCharisma: number;
  expectedCharisma: number;
  overClics: number;
  overClicHighScores: OverClicScore[];
};

export const useVolunteerAvailabilityStore = defineStore(
  "volunteer-availability",
  {
    state: (): State => ({
      availabilities: Availabilities.init(),
      currentCharisma: 0,
      expectedCharisma: 0,
      overClics: 0,
      overClicHighScores: [],
    }),
    actions: {
      clearVolunteerAvailabilities() {
        this._initAvailabilities([]);
        this.currentCharisma = 0;
        this.expectedCharisma = 0;
        this.overClics = 0;
      },

      async fetchVolunteerAvailabilities(userId: number) {
        const myStore = useMyStore();
        this.currentCharisma = myStore.loggedUser?.charisma ?? 0;
        this.expectedCharisma = this.currentCharisma;

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

        const myStore = useMyStore();
        myStore.fetchMyInformations();
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

      async fetchOverClicHighScores(): Promise<OverClicScore[]> {
        const res = await repo.getOverClicHighScores();
        if (isHttpError(res)) return [];
        this.overClicHighScores = res.map(castOverClicScoreWithDate);
        return this.overClicHighScores;
      },

      async saveOverClicScore(score: number) {
        const res = await repo.saveOverClicScore(score);
        if (isHttpError(res)) return;
        sendSuccessNotification("Bien joué 🚀");
        this.overClicHighScores = res.map(castOverClicScoreWithDate);
        this.resetCharismaToExpectedValue();
      },

      resetCharismaToExpectedValue() {
        this.currentCharisma = this.expectedCharisma;
        this.overClics = 0;
      },

      selectAvailability(date: OverDate, charisma: number) {
        this.availabilities = this.availabilities.select(date);
        this.currentCharisma = this.currentCharisma + charisma;
        const isAlreadyAvailable = date.isIncludedBy(this.availabilities.list);
        if (isAlreadyAvailable) this.overClics += 1;
        else this.expectedCharisma = this.expectedCharisma + charisma;
      },

      unSelectAvailability(date: OverDate, charisma: number) {
        this.availabilities = this.availabilities.unselect(date);
        this.currentCharisma = this.currentCharisma - charisma;
        this.expectedCharisma = this.expectedCharisma - charisma;
      },

      _initAvailabilities(recorded: Period[]) {
        this.availabilities = Availabilities.init({ recorded });
      },
    },
  },
);

function castOverClicScoreWithDate(
  score: HttpStringified<OverClicScore>,
): OverClicScore {
  return { ...score, createdAt: new Date(score.createdAt) };
}
