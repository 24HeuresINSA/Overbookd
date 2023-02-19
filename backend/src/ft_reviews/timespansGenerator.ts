import { TimeWindow, Timespan } from '../ft/ftTypes';

type LiteTimeWindow = Pick<TimeWindow, 'id' | 'start' | 'end' | 'sliceTime'>;
type Period = {
  start: Date;
  end: Date;
};
class TimespansGeneratorException extends Error {}
const ONE_HOUR_IN_MS = 60 * 60 * 1000;

const DIVIDABLE_ERROR_MESSAGE =
  'Time window duration is not dividable by the slice time';

export class TimespansGenerator {
  static generateTimespans(timeWindow: LiteTimeWindow): Timespan[] {
    if (!TimespansGenerator.canBeSliced(timeWindow)) {
      throw new TimespansGeneratorException(DIVIDABLE_ERROR_MESSAGE);
    }
    return TimespansGenerator.splitInTimespans(timeWindow);
  }

  private static splitInTimespans({
    id,
    start,
    end,
    sliceTime,
  }: LiteTimeWindow): Timespan[] {
    const durationInHour = TimespansGenerator.computeDuration({ start, end });
    const stepDuration = sliceTime ?? durationInHour;
    const nbTimespans = durationInHour / stepDuration;
    return Array.from({ length: nbTimespans }).map(
      TimespansGenerator.buildTimespan(start, stepDuration, id),
    );
  }

  private static buildTimespan(
    start: Date,
    stepDuration: number,
    timeWindowId: number,
  ) {
    return (_, step: number) => {
      const slicedStart = TimespansGenerator.computeSlicedStart(
        start,
        step,
        stepDuration,
      );
      const slicedEnd = TimespansGenerator.computeSlicedEnd(
        start,
        step,
        stepDuration,
      );
      return {
        timeWindowId,
        start: slicedStart,
        end: slicedEnd,
      };
    };
  }

  private static computeSlicedStart(
    start: Date,
    step: number,
    duration: number,
  ) {
    return TimespansGenerator.generateStepedDate(start, step, duration);
  }

  private static computeSlicedEnd(start: Date, step: number, duration: number) {
    return TimespansGenerator.generateStepedDate(start, step + 1, duration);
  }

  private static generateStepedDate(
    start: Date,
    step: number,
    duration: number,
  ) {
    return new Date(start.getTime() + step * duration * ONE_HOUR_IN_MS);
  }

  private static canBeSliced({ start, end, sliceTime }: LiteTimeWindow) {
    const durationInHour = TimespansGenerator.computeDuration({ start, end });
    return durationInHour % (sliceTime ?? 1) === 0;
  }

  private static computeDuration(period: Period) {
    return TimespansGenerator.computeDurationInMs(period) / ONE_HOUR_IN_MS;
  }

  private static computeDurationInMs({ start, end }: Period) {
    return end.getTime() - start.getTime();
  }
}
