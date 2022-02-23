import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import FTModel, {IFT, ITimeFrame} from "@entities/FT";
import logger from "@shared/Logger";
import FAModel, {ITimeframe} from "@entities/FA";
import {timeframeToTimeSpan} from "@src/services/slicing";
import { ITimeSpan } from "@entities/TimeSpan";

export async function getAllFTs(req: Request, res: Response) {
  const mFTs = await FTModel.find({});
  res.json({data: mFTs});
}

export async function getFTByID(req: Request, res: Response) {
  const mFT = await FTModel.findOne({count: +req.params.FTID});
  res.json(mFT);
}

export async function createFT(req: Request, res: Response) {
  const mFT = <IFT>req.body;
  const count = await FTModel.countDocuments();
  mFT.count = count + 1;
  const FT = await FTModel.create(mFT);
  res.json(FT);
}

export async function updateFT(
  req: Request<Record<string, never>, Record<string, never>, IFT>,
  res: Response
): Promise<void> {
  const mFT = req.body;
  if (mFT._id) {
    try {
      await FTModel.findByIdAndUpdate(mFT._id, mFT);
    } catch (e) {
      logger.err(e);
    }
    res.sendStatus(StatusCodes.OK);
  } else {
    res.sendStatus(StatusCodes.BAD_REQUEST);
  }
}

/**
 * @deprecated
 */
export async function unassign(req: Request, res: Response) {
  // unassign a user from an FT
  // const { FTID, _id } = req.body;
  // const FT = await FTModel.findById(FTID);
  // if (FT) {
  //   const mFT = <IFT>FT.toObject();
  //   mFT.schedules?.forEach((schedule) => {
  //     if (schedule.assigned) {
  //       schedule.assigned = schedule.assigned.filter(
  //         (assign) => assign._id !== _id
  //       );
  //     }
  //   });
  //   logger.info(`unassigning ${FTID}`);
  //   await FTModel.findByIdAndUpdate(FTID, {
  //     schedules: mFT.schedules,
  //   });
  // }
}

export async function deleteFT(req: Request, res: Response) {
  const mFT = <IFT>req.body;
  logger.info(`deleting FT: ${mFT.count}...`);
  if (mFT.count) {
    await FTModel.findOneAndUpdate(
      {count: mFT.count},
      {$set: {isValid: false}}
    );
    if (mFT.FA) {
      logger.info(`deleting FT: ${mFT.count} from FA ${mFT.FA}`);
      const mFA = await FAModel.findOne({count: mFT.FA});
      if (mFA && mFA.FTs) {
        mFA.FTs = mFA.FTs.filter((FT) => FT.count !== mFT.count);
        mFA.save();
        logger.info(`deleted FT`);
      }
    }
    res.status(StatusCodes.OK).json({mFT});
  } else {
    res.sendStatus(StatusCodes.BAD_REQUEST);
  }
}

export async function makeFTReady(req: Request, res: Response) {
  const FTCount = req.params.count as string;
  const FT = await FTModel.findOne({count: +FTCount});
  if (FT) {
    const mFT = <IFT>FT.toObject();
    logger.info(`making FT ${mFT.general.name} ready...`);
    mFT.isValid = true;
    mFT.status = "ready";
    const r: ITimeSpan[][] = [];

    // slice timeframes
    for (const timeframe of mFT.timeframes) {
      const timespan = await timeframeToTimeSpan(timeframe);
      if (timespan) {
        r.push(timespan);
      }
    }
    // await FTModel.findOneAndUpdate({ count: mFT.count, }, mFT);
    res.status(StatusCodes.OK).json(r);
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "FT not found or not validated",
    });
  }

}
