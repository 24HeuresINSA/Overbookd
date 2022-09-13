import {IFT} from "@entities/FT";
import {Types} from "mongoose";
import FTModel, {ITimeFrame} from "../entities/FT";
import {queryFTWhereUserIsRequiredOnDateRange} from "./FT";

export type getTimeFrameByIdOpts = {
  select: Array<keyof ITimeFrame>;
  ft: { include: boolean; fields: Array<keyof IFT> };
};

/**
 * Find timeFrame from its ID
 * Not optimized this is done because of the lack of time to refactor database.
 * @param TFId TimeFrameId
 */
export async function getTimeFrameById(
  TFId: string,
  options: getTimeFrameByIdOpts = {
    select: [],
    ft: { include: false, fields: [] },
  }
): Promise<any | undefined> {
  const ft = await FTModel.findOne({ "timeframes._id": TFId }).lean();

  if (ft) {
    // use spread to avoid circular ref
    const tf: any = { ...ft.timeframes[0] };
    // remove fields not selected
    if (options.select.length != 0) {
      (Object.keys(tf) as Array<keyof ITimeFrame>)
        .filter((k) => k != "_id")
        .filter((k) => !options.select.includes(k))
        .forEach((k) => delete tf[k]);
    }

    if (options.ft.fields.length == 0) {
      options.ft.fields = (Object.keys(ft) as Array<keyof IFT>).filter(
        (k) => k != "timeframes"
      );
    }
    tf.ft = {};
    options.ft.fields.forEach((f) => {
      tf.ft[f] = ft[f];
    });
    tf.ft._id = ft._id;
    return tf;
  }
  // nothing found
  return undefined;
}

export async function getTimeFramesWhereUserIsRequired(
  userId: Types.ObjectId,
  range: { start: number; end: number },
  excludeFTs: number[] = []
): Promise<ITimeFrame[]> {
  const matchFTQuery = queryFTWhereUserIsRequiredOnDateRange(
    range,
    userId,
    excludeFTs
  );

  const matchTimeframeQuery = queryTimeframesWhereUserIsRequiredOnDateRange(range, userId);

  const timeframes = await FTModel.aggregate()
    .match(matchFTQuery)
    .unwind("$timeframes")
    .replaceRoot("$timeframes")
    .match(matchTimeframeQuery);
  return timeframes;
}
function queryTimeframesWhereUserIsRequiredOnDateRange(range: { start: number; end: number; }, userId: Types.ObjectId): any {
  return {
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
  };
}

