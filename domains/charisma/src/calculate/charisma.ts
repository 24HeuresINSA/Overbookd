import { IProvidePeriod, ONE_HOUR_IN_MS, Period } from "@overbookd/time";

type CharismaEvent = {
  charisma: number;
};
type CharismaPeriod = IProvidePeriod & {
  charisma: number;
};

export class Charisma {
  constructor(
    private events: CharismaEvent[],
    private availabilities: IProvidePeriod[],
    private periods: CharismaPeriod[],
  ) {}

  static init(): Charisma {
    return new Charisma([], [], []);
  }

  addEvents(events: CharismaEvent[]): Charisma {
    return new Charisma(events, this.availabilities, this.periods);
  }

  addAvailabilities(
    availabilities: IProvidePeriod[],
    periods: CharismaPeriod[],
  ): Charisma {
    return new Charisma(this.events, availabilities, periods);
  }

  calculate(): number {
    const fromEvents = this.events.reduce(
      (acc, event) => acc + event.charisma,
      0,
    );
    const splitedAvailabilities = this.availabilities.flatMap(
      (availability) => {
        return Period.init(availability).splitWithIntervalInMs(ONE_HOUR_IN_MS);
      },
    );
    const fromAvailabilities: number = splitedAvailabilities.reduce(
      (acc, availability) => {
        const period = this.periods.find((p) =>
          Period.init(p).includes(availability),
        );
        return period ? acc + period.charisma : acc;
      },
      0,
    );
    return fromEvents + fromAvailabilities;
  }
}
