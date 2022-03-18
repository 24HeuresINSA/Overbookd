/**
 * slice a timeframe into a time span
 */
import { ITFRequired, ITimeFrame } from "@entities/FT";
import { ITimeSpan } from "@entities/TimeSpan";
import logger from "@shared/Logger";
import {Types} from "mongoose";

export async function timeframeToTimeSpan(
  timeframe: ITimeFrame,
  FTID: number,
): Promise<ITimeSpan[] | undefined> {
  const { toSlice, sliceTime, required } = timeframe;
  const start = new Date(timeframe.start);
  const end = new Date(timeframe.end);
  const timeSpans: ITimeSpan[] = [] as ITimeSpan[];
  if (toSlice && sliceTime) {
    if (isSlicable(start, end, sliceTime)) {
      // slice;
      logger.info(`timeframeToTimeSpan: starting slicing...`);
      const delta = (end.getTime() - start.getTime()) / (60 * 60 * 1000);
      const slicesCount = delta / sliceTime;
      logger.info(`timeframeToTimeSpan: slicesCount: ${slicesCount}`);
      let timeSpanStart = start;
      const isHalfHourSlicing = sliceTime % 1 === 0;
      const timeSpanDelta = sliceTime * 60 * 60 * 1000;
      for (let index = 0; index < slicesCount; index++) {
        console.log(
          `timeframeToTimeSpan: timeSpanStart: ${timeSpanStart.toLocaleString()}`
        );
        const mTimeSpan = {
          start: timeSpanStart,
          end: new Date(timeSpanStart.getTime() + timeSpanDelta),
          assigned: null,
          timeframeID: timeframe._id,
          required: null,
          FTID,
        } as ITimeSpan;
        // timeSpans.push(mTimeSpan);
        timeframe.required.forEach((r: ITFRequired) => {
          switch (r.type) {
            case "user":
              timeSpans.push({
                ...mTimeSpan,
                required: r.user._id.toString(),
                assigned: r.user._id.toString(),
              });
              break;
            case "team":
              for(let i = 0; i <= r.amount; i++){
                timeSpans.push({
                  ...mTimeSpan,
                  required: r.team,
                });
              }
              break;
            default:
              break;
          }
        });
        logger.info(
          `timeframeToTimeSpan: added timeSpan: ${new Date(
            mTimeSpan.start
          ).toLocaleString()} - ${new Date(mTimeSpan.end).toLocaleString()}`
        );
        timeSpanStart = new Date(timeSpanStart.getTime() + timeSpanDelta);
        logger.info(
          `timeframeToTimeSpan: timeSpanStart: ${timeSpanStart.toLocaleString()}`
        );
      }
      return timeSpans;
    } else {
      // can't be sliced
      throw new Error(
        `timeframeToTimeSpan: can't slice timeframe: ${timeframe.start} - ${timeframe.end}`
      );
    }
  } else {
    // not to be sliced
    const res = [] as ITimeSpan[];

    timeframe.required.forEach((r: ITFRequired) => {
      switch (r.type) {
        case "user":
          res.push({
            start,
            end,
            assigned: r.user._id.toString(),
            timeframeID: timeframe._id,
            required: r.user._id.toString(),
            FTID,
          });
          break;
        case "team":
          for (let i = 0; i < r.amount; i++) {
            res.push({
              start,
              end,
              assigned: null,
              timeframeID: timeframe._id,
              required: r.team,
              FTID,
            });
          }
          break;
        default:
          break;
      }
    });
    return res;
  }
}

function isSlicable(start: Date, end: Date, sliceTime: number) {
  const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  return hours % sliceTime === 0;
}
