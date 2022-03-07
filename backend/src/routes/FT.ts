import StatusCodes from "http-status-codes";
import {Request, Response} from "express";
import FTModel, {IFT} from "@entities/FT";
import logger from "@shared/Logger";
import FAModel from "@entities/FA";
import {getFAByCount} from "@src/routes/FA";
import {EnforceDocument, QueryWithHelpers} from "mongoose";

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
  mFT.count = count + 1
  const FT = await FTModel.create(mFT);
  res.json(FT);
}

export async function updateFT(req: Request, res: Response) {
  const mFT = <IFT>req.body;
  if (mFT._id) {
    //@ts-ignore
    await FTModel.findByIdAndUpdate(mFT._id, mFT);
    res.sendStatus(StatusCodes.OK);
  } else {
    res.sendStatus(StatusCodes.BAD_REQUEST);
  }
}

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
  logger.info(`deleting FT: ${mFT.count}...`)
  if (mFT.count) {
    await FTModel.findOneAndUpdate({count: mFT.count}, {$set: {isValid: false}});
    if (mFT.FA) {
      logger.info(`deleting FT: ${mFT.count} from FA ${mFT.FA}`)
      let mFA = await FAModel.findOne({count: mFT.FA});
      if (mFA && mFA.FTs) {
        mFA.FTs = mFA.FTs.filter((FT: IFT) => FT.count !== mFT.count);
        mFA.save()
        logger.info(`deleted FT`)
      }
    }
    res.status(StatusCodes.OK).json({mFT});
  } else {
    res.sendStatus(StatusCodes.BAD_REQUEST);
  }
}

export async function getFTsNumber(req: Request, res: Response) {
  let FTs: Array<{ _id: { count: number, status: string, FA: number } }> = await FTModel.aggregate()
    .match({
        $and: [
          {isValid: {$ne: false}},
        ]
      }
    )
    .group({
      _id: {
        count: '$count',
        status: '$status',
        FA: '$FA'
      }
    });

  const FAs: Array<{ _id: { count: number, team: string } }> = await FAModel.aggregate().group({
    _id: {
      count: '$count',
      team: '$general.team'
    }
  });
  let r = FTs.map((ft) => {
    let FA = FAs.find(e => e._id.count === ft._id.FA);
    if (FA != null) {
      return {
        status: ft._id.status,
        team: FA._id.team
      };
    } else {
      return {
        status: ft._id.status,
        team: 'undefined'
      };
    }
  });
  const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
    list.reduce((previous, currentItem) => {
      const group = getKey(currentItem);
      if (!previous[group]) previous[group] = [];
      previous[group].push(currentItem);
      return previous;
    }, {} as Record<K, T[]>);
  let t = groupBy(r, i => i.team);
  let result: Array<any> = [];
  for (let i in t) {
    let status: { draft: number, refused: number, submitted: number, validated: number } = {
      draft: 0,
      refused: 0,
      submitted: 0,
      validated: 0
    };
    let total = 0;
    for (let j in t[i]) {
      switch (t[i][j].status) {
        case 'draft':
          status.draft++;
          break;
        case 'refused':
          status.refused++;
          break;
        case 'submitted':
          status.submitted++;
          break;
        case 'validated':
          status.validated++;
          break;
        default:
          logger.info('Error in the FT count endpoint');
      }
      total++;
    }
    result.push({
      team: i,
      status: status,
      total: total
    });
    result.sort((a, b) => (0 - (a.team.toLowerCase() > b.team.toLowerCase() ? -1 : 1)));
  }
  logger.info("getting FTs count");
  res.json(result);
}
