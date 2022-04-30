import TimeSpanModel, { ITimeSpan } from "@entities/TimeSpan";
import { Types } from "mongoose";

export async function getTimespansWhereUserIsAssigned(
  userId: Types.ObjectId,
  range: { start: number; end: number },
  excludeFTs: number[] = []
): Promise<ITimeSpan[]> {
  const matchQuery = {
    FTID: {
      $nin: excludeFTs,
    },
    assigned: userId.toString(),
    start: {
      $lt: new Date(range.end),
    },
    end: {
      $gt: new Date(range.start),
    },
  };

  const timespans = await TimeSpanModel.find(matchQuery);

  return timespans;
}
