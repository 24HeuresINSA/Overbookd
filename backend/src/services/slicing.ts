/**
 * slice a timeframe into a time span
 */
import { ITFRequired, ITimeFrame, isTFRequiredTeam } from "@entities/FT";
import { TimeSpanForm } from "@entities/TimeSpan";
import logger from "@shared/Logger";

const ONE_HOUR_IN_MS = 60 * 60 * 1000;

export function timeframeToTimeSpan(
  timeframe: ITimeFrame,
  FTID: number
): TimeSpanForm[] {
  const {
    toSlice,
    sliceTime: timeSpanDurationInHours,
    _id: timeframeID,
    required,
    start: startInMs,
    end: endInMs
  } = timeframe;

  const start = new Date(startInMs);
  const end = new Date(endInMs);

  if (toSlice && timeSpanDurationInHours) {
    if (!isSlicable(start, end, timeSpanDurationInHours)) {
      throw new Error(
        `timeframeToTimeSpan: can't slice timeframe: ${timeframe.start} - ${timeframe.end}`
      );
    }

    const timespans = sliceTimeFrameIntoTimeSpans(
      { end, start, timeSpanDurationInHours, timeframeID, required },
      FTID
    );

    logger.info(
      `timeframeToTimeSpan: added ${
        timespans.length
      } timeSpan(s) for timeFrame (${start.toLocaleString()} - ${
        end.toLocaleString()
      })`
    );
    return timespans;
  } else {
    // not to be sliced
    const timeSpanTemplate = {
      start,
      end,
      assigned: null,
      timeframeID,
      required: null,
      FTID,
    } as TimeSpanForm;

    const timespans = generateTimeSpansAccordingToRequriedEntities(required, timeSpanTemplate);
    logger.info(
      `timeframeToTimeSpan: added ${
        timespans.length
      } timeSpan(s) for timeFrame (${start.toLocaleString()} - ${
        end.toLocaleString()
      })`
    );
    return timespans;
  }
}

function generateTimeSpansAccordingToRequriedEntities(required: ITFRequired[], timeSpanTemplate: TimeSpanForm) {
  return required.flatMap((r) => generateTimeSpansAccordingToRequiredEntity(timeSpanTemplate, r)
  );
}

function sliceTimeFrameIntoTimeSpans(
  {
    end,
    start,
    timeSpanDurationInHours,
    timeframeID,
    required,
  }: {
    end: Date;
    start: Date;
    timeSpanDurationInHours: number;
    timeframeID: string;
    required: ITFRequired[];
  },
  FTID: number
): TimeSpanForm[] {
  logger.info(`timeframeToTimeSpan: starting slicing...`);
  const timeFrameDurationInMs = end.getTime() - start.getTime();
  const timeSpanDurationInMs = timeSpanDurationInHours * ONE_HOUR_IN_MS;
  const nbTimeFrameFragments = timeFrameDurationInMs / timeSpanDurationInMs;
  logger.info(`timeframeToTimeSpan: Should generate ${nbTimeFrameFragments} time frame fragments`);

  const timespans = new Array(nbTimeFrameFragments).fill(null).flatMap((_, index) => {
    const timeSpanStart = new Date(
      start.getTime() + index * timeSpanDurationInMs
    );
    const timeSpanTemplate = {
      start: timeSpanStart,
      end: new Date(timeSpanStart.getTime() + timeSpanDurationInMs),
      assigned: null,
      timeframeID,
      required: null,
      FTID,
    } as TimeSpanForm;
    const requiredTimeSpans = generateTimeSpansAccordingToRequriedEntities(required, timeSpanTemplate);
    logger.info(
      `timeframeToTimeSpan: added ${
        requiredTimeSpans.length
      } timeSpan(s): ${new Date(
        timeSpanTemplate.start
      ).toLocaleString()} - ${new Date(timeSpanTemplate.end).toLocaleString()}`
    );
    return requiredTimeSpans;
  });
  return timespans;
}

function isSlicable(start: Date, end: Date, sliceTime: number) {
  const hours = (end.getTime() - start.getTime()) / ONE_HOUR_IN_MS;
  return hours % sliceTime === 0;
}

function generateTimeSpansAccordingToRequiredEntity(
  timeSpanTemplate: TimeSpanForm,
  required: ITFRequired
): TimeSpanForm[] {
  if (isTFRequiredTeam(required)) {
    return new Array(required.amount).fill({
      ...timeSpanTemplate,
      required: required.team,
    });
  }
  return [
    {
      ...timeSpanTemplate,
      required: required.user._id.toString(),
      assigned: required.user._id,
    },
  ];
}
