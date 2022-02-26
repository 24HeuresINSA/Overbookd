import { IFT } from "@entities/FT";
import FTModel from "../entities/FT";
import { ITimeFrame } from "../entities/FT";

export type getTimeFrameByIdOpts = {
  select: Array<keyof ITimeFrame>;
  ft: { include: boolean; fields: Array<keyof IFT> };
};

/**
 * Find timeFrame from its ID
 * Not optimized this is done because of the lack of time to refactor database.
 * todo: Put timeframes in a separate collection
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

/**
 * Get all Timeframes in DB with type user
 */
export async function getAllOrgaTFs(): Promise<ITimeFrame[]> {
  return await FTModel.aggregate()
    .unwind("$timeframes")
    .replaceRoot("$timeframes")
    .match({ "required.type": "user" });
}
