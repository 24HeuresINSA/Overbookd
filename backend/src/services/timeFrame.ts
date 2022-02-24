import { ITimeframe } from "@entities/FA";
import FTModel from "../entities/FT";

/**
 * Find timeFrame from its ID
 * Not optimized this is done because of the lack of time to refactor database.
 * todo: Put timeframes in a separate collection
 * @param TFId TimeFrameId
 */
export async function getTimeFrameById(TFId: string): Promise<ITimeframe> {
  //@ts-ignore
  return FTModel.aggregate()
    .unwind("$timeframes")
    .replaceRoot("$timeframes")
    .match({ _id: TFId });
}
