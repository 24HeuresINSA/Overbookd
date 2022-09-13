import FTModel, {IFT} from "@entities/FT";
import TimeSpanModel from "@entities/TimeSpan";
import {team} from "@entities/User";
import {Types} from "mongoose";

export async function getFTsWhereUserIsRequired(
  userId: Types.ObjectId,
  range: { start: number; end: number },
  excludeFTs: number[] = []
): Promise<IFT[]> {
  return FTModel.find(
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
      $nin: excludeFTs,
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

interface FTWithRequiredRoles {
  teams: team[];
  _id: number;
}

export async function getTeamsToAssignOnEachFT(): Promise<FTWithRequiredRoles[]> {
  return TimeSpanModel.aggregate()
    .match({ assigned: null })
    .group({
      _id: "$FTID",
      teams: { $addToSet: "$required" },
    });
}
