import { DataBaseUserRequest } from '../ft-user-request/dto/ft-user-request.response.dto';
import { TimeSpan, TimeWindow } from '../ft/ftTypes';
import { ONE_HOUR_IN_MS } from '@overbookd/period';
import { getPeriodDuration } from '../utils/duration';

type LiteTimeWindow = Pick<TimeWindow, 'id' | 'start' | 'end' | 'sliceTime'> & {
  userRequests: DataBaseUserRequest[];
};
type Period = {
  start: Date;
  end: Date;
};
class TimeSpansGeneratorException extends Error {}

const DIVIDABLE_ERROR_MESSAGE =
  'Time window duration is not dividable by the slice time';

type TimeSpanBuilderParams = {
  start: Date;
  stepDuration: number;
  timeWindowId: number;
  userRequests: DataBaseUserRequest[];
};

export class TimeSpansGenerator {
  static generateTimeSpans(timeWindow: LiteTimeWindow): TimeSpan[] {
    if (!TimeSpansGenerator.canBeSliced(timeWindow)) {
      throw new TimeSpansGeneratorException(DIVIDABLE_ERROR_MESSAGE);
    }
    return TimeSpansGenerator.splitInTimeSpans(timeWindow);
  }

  private static splitInTimeSpans({
    id,
    start,
    end,
    sliceTime,
    userRequests,
  }: LiteTimeWindow): TimeSpan[] {
    const durationInHour = TimeSpansGenerator.computeDuration({ start, end });
    const stepDuration = sliceTime ?? durationInHour;
    const nbTimeSpans = durationInHour / stepDuration;
    return Array.from({ length: nbTimeSpans }).map(
      TimeSpansGenerator.buildTimeSpan({
        start,
        userRequests,
        stepDuration,
        timeWindowId: id,
      }),
    );
  }

  private static buildTimeSpan({
    start,
    stepDuration,
    timeWindowId,
    userRequests,
  }: TimeSpanBuilderParams) {
    return (_, step: number) => {
      const slicedStart = TimeSpansGenerator.computeSlicedStart(
        start,
        step,
        stepDuration,
      );
      const slicedEnd = TimeSpansGenerator.computeSlicedEnd(
        start,
        step,
        stepDuration,
      );
      return {
        timeWindowId,
        start: slicedStart,
        end: slicedEnd,
        assignments: this.buildAssignments(userRequests),
      };
    };
  }

  private static computeSlicedStart(
    start: Date,
    step: number,
    duration: number,
  ) {
    return TimeSpansGenerator.generateStepedDate(start, step, duration);
  }

  private static computeSlicedEnd(start: Date, step: number, duration: number) {
    return TimeSpansGenerator.generateStepedDate(start, step + 1, duration);
  }

  private static buildAssignments(userRequests: DataBaseUserRequest[]) {
    return userRequests.map(({ id, user }) => ({
      userRequestId: id,
      assigneeId: user.id,
    }));
  }

  private static generateStepedDate(
    start: Date,
    step: number,
    duration: number,
  ) {
    return new Date(start.getTime() + step * duration * ONE_HOUR_IN_MS);
  }

  private static canBeSliced({ start, end, sliceTime }: LiteTimeWindow) {
    const durationInHour = TimeSpansGenerator.computeDuration({ start, end });
    return durationInHour % (sliceTime ?? durationInHour) === 0;
  }

  private static computeDuration(period: Period) {
    return getPeriodDuration(period) / ONE_HOUR_IN_MS;
  }
}
