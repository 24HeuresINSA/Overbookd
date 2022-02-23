/**
 * slice a timeframe into a time span
 */
import {ITFRequired, ITimeFrame} from "@entities/FT";
import {ITimeSpan} from "@entities/TimeSpan";
import logger from "@shared/Logger";

export async function timeframeToTimeSpan(timeframe: ITimeFrame): Promise<ITimeSpan[] | undefined>{
  const {toSlice, sliceTime, required } = timeframe;
  const start = new Date(timeframe.start);
  const end = new Date(timeframe.end);
  const timeSpans: ITimeSpan[] = [] as ITimeSpan[];
  if (toSlice && sliceTime) {
    if (isSlicable(start, end, sliceTime)){ // slice;
      logger.info(`timeframeToTimeSpan: starting slicing...`);
      const delta = (end.getTime() - start.getTime()) / (60 * 60 * 1000);
      const slicesCount = delta / sliceTime;
      logger.info(`timeframeToTimeSpan: slicesCount: ${slicesCount}`);
      let timeSpanStart = start;
      const isHalfHourSlicing = sliceTime % 1 === 0;
      const timeSpanDelta = sliceTime * 60 * 60 * 1000;
      for (let index = 0; index < slicesCount;index++){
        console.log(`timeframeToTimeSpan: timeSpanStart: ${timeSpanStart.toLocaleString()}`);
        const mTimeSpan = {
          start: timeSpanStart,
          end: new Date(timeSpanStart.getTime() + timeSpanDelta),
          assigned: null,
          timeframeID: timeframe._id,
          required: null,
        } as ITimeSpan;
        // timeSpans.push(mTimeSpan);
        timeframe.required.forEach(r => {
          timeSpans.push({
            ...mTimeSpan,
            required: r,
          });
        })
        logger.info(`timeframeToTimeSpan: added timeSpan: ${new Date(mTimeSpan.start).toLocaleString()} - ${new Date(mTimeSpan.end).toLocaleString()}`);
        timeSpanStart = new Date(timeSpanStart.getTime() + timeSpanDelta);
        logger.info(`timeframeToTimeSpan: timeSpanStart: ${timeSpanStart.toLocaleString()}`);
      }
      return timeSpans;
    } else { // can't be sliced
      return ;
    }
  } else { // not to be sliced
    const res = required.map((requirement: ITFRequired) => {
      return {
        start,
        end,
        assigned: null,
        required: requirement,
        timeframeID: timeframe._id,
      };
    }) as ITimeSpan[];
    return res;

  }

};

function isSlicable(start: Date, end: Date, sliceTime: number) {
  const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return hours % sliceTime === 0;
}