import { IProvidePeriod, Period } from "@overbookd/time";
import { TimeWindowAlreadyExists } from "../../festival-activity.error.js";
import { TimeWindow } from "../../../common/time-window.js";
import { WithAtLeastOneItem } from "@overbookd/list";
import { PrepareError } from "../prepare-in-review-festival-activity.js";

export class TimeWindows<T extends TimeWindow[]> {
  private constructor(private readonly timeWindows: T) {}

  get entries(): T {
    return this.timeWindows;
  }

  static build<U extends TimeWindow[]>(timeWindows: U): TimeWindows<U> {
    return new TimeWindows(timeWindows);
  }

  add(period: IProvidePeriod): TimeWindows<WithAtLeastOneItem<TimeWindow>> {
    const { id, start, end } = Period.init(period);
    const timeWindow = { id, start, end };
    const alreadyExists = this.timeWindows.some((tw) => tw.id === id);
    if (alreadyExists) throw new TimeWindowAlreadyExists();

    return new TimeWindows<WithAtLeastOneItem<TimeWindow>>([
      timeWindow,
      ...this.timeWindows,
    ]);
  }

  update(
    currentId: TimeWindow["id"],
    period: IProvidePeriod,
  ): TimeWindows<WithAtLeastOneItem<TimeWindow>> {
    const exists = this.timeWindows.some((tw) => tw.id === currentId);
    if (!exists) throw new PrepareError.TimeWindowNotFound();

    const { id, start, end } = Period.init(period);
    const timeWindow = { id, start, end };
    const timeWindows = this.timeWindows.map((tw) =>
      tw.id === currentId ? timeWindow : tw,
    ) as WithAtLeastOneItem<TimeWindow>;

    return new TimeWindows<WithAtLeastOneItem<TimeWindow>>(timeWindows);
  }

  remove(id: TimeWindow["id"]): TimeWindows<TimeWindow[]> {
    return new TimeWindows(this.timeWindows.filter((tw) => tw.id !== id));
  }
}
