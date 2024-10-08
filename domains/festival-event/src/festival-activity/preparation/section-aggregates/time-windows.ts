import { Duration, IProvidePeriod, Period } from "@overbookd/time";
import { TimeWindowAlreadyExists } from "../../festival-activity.error.js";
import { TimeWindow } from "../../../common/time-window.js";
import { WithAtLeastOneItem } from "@overbookd/list";

export class TimeWindows<T extends TimeWindow[]> {
  private constructor(private readonly timeWindows: T) {}

  get entries(): T {
    return this.timeWindows;
  }

  static build<U extends TimeWindow[]>(timeWindows: U): TimeWindows<U> {
    return new TimeWindows(timeWindows);
  }

  add(period: IProvidePeriod): TimeWindows<WithAtLeastOneItem<TimeWindow>> {
    const { start, end } = Period.init(period);
    const id = this.generateTimeWindowId({ start, end });
    const timeWindow = { id, start, end };

    const alreadyExists = this.timeWindows.some((tw) => tw.id === id);
    if (alreadyExists) throw new TimeWindowAlreadyExists();

    return new TimeWindows<WithAtLeastOneItem<TimeWindow>>([
      timeWindow,
      ...this.timeWindows,
    ]);
  }

  remove(id: TimeWindow["id"]): TimeWindows<TimeWindow[]> {
    return new TimeWindows(this.timeWindows.filter((tw) => tw.id !== id));
  }

  private generateTimeWindowId(period: IProvidePeriod): TimeWindow["id"] {
    const { start, end } = period;
    const startMinutes = Duration.ms(start.getTime()).inMinutes;
    const endMinutes = Duration.ms(end.getTime()).inMinutes;

    return `${startMinutes}-${endMinutes}`;
  }
}
