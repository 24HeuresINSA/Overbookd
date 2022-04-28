import FTModel, { IFT } from "@entities/FT";
import { Types } from "mongoose";

export async function getFTsWhereUserIsRequired(
  userId: Types.ObjectId,
  range: { start: number; end: number },
  excludeFTs: number[] = []
): Promise<IFT[]> {
  return await FTModel.find(
    queryFTWhereUserIsRequiredOnDateRange(range, userId, excludeFTs)
  );
}

export function queryFTWhereUserIsRequiredOnDateRange(
  range: { start: number; end: number },
  userId: Types.ObjectId,
  excludeFTs: number[] = []
): any {
  return {
    count: {
      $nin: excludeFTs
    },
    timeframes: {
      $elemMatch: {
        start: {
          $lt: range.end,
        },
        end: {
          $gt: range.start,
        },
        required: {
          $elemMatch: {
            type: "user",
            "user._id": Types.ObjectId(userId.toString()),
          },
        },
      },
    },
  };
}
