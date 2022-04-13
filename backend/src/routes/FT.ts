import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import FTModel, { IFT } from "@entities/FT";
import logger from "@shared/Logger";
import FAModel from "@entities/FA";
import { updateConflictsByFTCount } from "@src/services/conflict";
import { timeframeToTimeSpan } from "@src/services/slicing";
import TimeSpanModel, { ITimeSpan } from "@entities/TimeSpan";
import { Types } from "mongoose";
import ConfigModel from "@entities/Config";
import UserModel from "@entities/User";

export async function getAllFTs(req: Request, res: Response) {
  const mFTs = await FTModel.find({});
  res.json({ data: mFTs });
}

export async function getFTByID(req: Request, res: Response) {
  const mFT = await FTModel.findOne({ count: +req.params.FTID });
  res.json(mFT);
}

export async function createFT(req: Request, res: Response) {
  const mFT = <IFT>req.body;
  const count = await FTModel.countDocuments();
  mFT.count = count + 1;
  const FT = await FTModel.create(mFT);
  await updateConflictsByFTCount(mFT.count);
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
      await updateConflictsByFTCount(mFT.count);
      if (mFT.status === "refused") {
        //delete all ²timespans of this FT
        logger.info(`delete all timespans of this FT ${mFT.count}`);
        await TimeSpanModel.deleteMany({ FTID: mFT.count });
      }
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
      { count: mFT.count },
      { $set: { isValid: false } }
    );
    if (mFT.FA) {
      logger.info(`deleting FT: ${mFT.count} from FA ${mFT.FA}`);
      const mFA = await FAModel.findOne({ count: mFT.FA });
      if (mFA && mFA.FTs) {
        mFA.FTs = mFA.FTs.filter((FT) => FT.count !== mFT.count);
        mFA.save();
        logger.info(`deleted FT`);
      }
    }
    await updateConflictsByFTCount(mFT.count);
    res.status(StatusCodes.OK).json({ mFT });
  } else {
    res.sendStatus(StatusCodes.BAD_REQUEST);
  }
}

export async function getFTsNumber(req: Request, res: Response) {
  const FTs: Array<{ _id: { count: number; status: string; FA: number } }> =
    await FTModel.aggregate()
      .match({
        $and: [{ isValid: { $ne: false } }],
      })
      .group({
        _id: {
          count: "$count",
          status: "$status",
          FA: "$FA",
        },
      });

  const FAs: Array<{ _id: { count: number; team: string } }> =
    await FAModel.aggregate().group({
      _id: {
        count: "$count",
        team: "$general.team",
      },
    });
  const r = FTs.map((ft) => {
    const FA = FAs.find((e) => e._id.count === ft._id.FA);
    if (FA != null) {
      return {
        status: ft._id.status,
        team: FA._id.team,
      };
    } else {
      return {
        status: ft._id.status,
        team: "undefined",
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
  const t = groupBy(r, (i) => i.team);
  const result: Array<any> = [];
  for (const i in t) {
    const status: {
      draft: number;
      refused: number;
      submitted: number;
      validated: number;
    } = {
      draft: 0,
      refused: 0,
      submitted: 0,
      validated: 0,
    };
    let total = 0;
    for (const j in t[i]) {
      switch (t[i][j].status) {
        case "draft":
          status.draft++;
          break;
        case "refused":
          status.refused++;
          break;
        case "submitted":
          status.submitted++;
          break;
        case "validated":
          status.validated++;
          break;
        default:
          logger.info("Error in the FT count endpoint");
      }
      total++;
    }
    result.push({
      team: i,
      status: status,
      total: total,
    });
    result.sort(
      (a, b) => 0 - (a.team.toLowerCase() > b.team.toLowerCase() ? -1 : 1)
    );
  }
  logger.info("getting FTs count");
  res.json(result);
}

export async function makeFTReady(req: Request, res: Response) {
  const FTCount = req.params.count as string;
  const FT = await FTModel.findOne({ count: +FTCount });
  if (FT) {
    const mFT = <IFT>FT.toObject();
    logger.info(`making FT ${mFT.general.name} ready...`);
    mFT.isValid = true;
    mFT.status = "ready";
    const r: ITimeSpan[][] = [];

    try {
      // slice timeframes
      for (const timeframe of mFT.timeframes) {
        const timespan = await timeframeToTimeSpan(timeframe, mFT.count);
        if (timespan) {
          r.push(timespan);
          await TimeSpanModel.insertMany(timespan);
        }
      }
      // await FTModel.findOneAndUpdate({ count: mFT.count, }, mFT);
      res.status(StatusCodes.OK).json(r);
    } catch (e) {
      logger.err(e);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Error while making FT ready, timeframe can't be sliced",
      });
    }
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "FT not found or not validated",
    });
  }
}

export async function myPlanning(req: Request, res: Response) {
  const showFt = await ConfigModel.findOne({ key: "show_ft_in_planning" });

  let FTs: Array<{ _id: string; userName: string; slots: any[] }> = [];
  if (showFt && showFt.value) {
    FTs = await FTModel.aggregate()
      .match({
        $and: [{ isValid: { $ne: false } }, { status: { $ne: "ready" } }],
      })
      .project({
        _id: 0,
        count: 1,
        general: 1,
        status: 1,
        isValid: 1,
        timeframes: 1,
      })
      .unwind({ path: "$timeframes" })
      .unwind({ path: "$timeframes.required" })
      .match({
        "timeframes.required.user._id": Types.ObjectId(req.params.userID),
      })
      .match({ "timeframes.required.type": "user" })
      .lookup({
        from: "conflicts",
        localField: "timeframes.required.user._id",
        foreignField: "user",
        let: { id: "$timeframes._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [{ $eq: ["$$id", "$tf1"] }, { $eq: ["$$id", "$tf2"] }],
              },
            },
          },
        ],
        as: "conflicts",
      })
      .group({
        _id: "$timeframes.required.user._id",
        userName: { $first: "$timeframes.required.user.username" },
        slots: {
          $push: {
            count: "$count",
            name: "$general.name",
            status: "$status",
            start: "$timeframes.start",
            end: "$timeframes.end",
            conflits: "$conflicts",
          },
        },
      });

    // As all the _id don't have the same type, we need to do AGAIN the group by
    const grouped = FTs.reduce((acc, cur) => {
      // @ts-ignore
      if (!acc[cur._id]) {
        // @ts-ignore
        acc[cur._id] = {
          _id: cur._id,
          userName: cur.userName,
          slots: [],
        };
      }
      // @ts-ignore
      acc[cur._id].slots.push(...cur.slots);
      return acc;
    }, {});
    FTs = Object.values(grouped);
  } else {
    const user = await UserModel.findOne({ _id: req.params.userID });
    FTs = [
      {
        // @ts-ignore
        _id: user._id.toString(),
        // @ts-ignore
        userName: user.firstname + " " + user.lastname,
        slots: [],
      },
    ];
  }

  const timespans = await TimeSpanModel.aggregate()
    .match({ assigned: req.params.userID })
    .lookup({
      from: "fts",
      localField: "FTID",
      foreignField: "count",
      as: "FT",
    })
    .project({
      _id: 0,
      count: "$FTID",
      start: 1,
      end: 1,
      name: { $first: "$FT.general.name" },
      status: "affected",
    });

  FTs[0].slots.push(...timespans);

  // sort slots by start date
  FTs.forEach((ft) => {
    ft.slots.sort((a, b) => 0 - (a.start < b.start ? 1 : -1));
  });

  res.json(FTs);
}

export async function getOrgaRequis(req: Request, res: Response) {
  const showFt = await ConfigModel.findOne({ key: "show_ft_in_planning" });

  let FTs: Array<{ _id: string; userName: string; slots: any[] }> = [];
  if (showFt && showFt.value) {
    FTs = await FTModel.aggregate()
      .match({
        $and: [{ isValid: { $ne: false } }, { status: { $ne: "ready" } }],
      })
      .project({
        _id: 0,
        count: 1,
        general: 1,
        status: 1,
        isValid: 1,
        timeframes: 1,
      })
      .unwind({ path: "$timeframes" })
      .unwind({ path: "$timeframes.required" })
      .match({ "timeframes.required.type": "user" })
      .lookup({
        from: "conflicts",
        localField: "timeframes.required.user._id",
        foreignField: "user",
        let: { id: "$timeframes._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [{ $eq: ["$$id", "$tf1"] }, { $eq: ["$$id", "$tf2"] }],
              },
            },
          },
        ],
        as: "conflicts",
      })
      .group({
        _id: "$timeframes.required.user._id",
        userName: { $first: "$timeframes.required.user.username" },
        slots: {
          $push: {
            count: "$count",
            name: "$general.name",
            status: "$status",
            start: "$timeframes.start",
            end: "$timeframes.end",
            conflits: "$conflicts",
          },
        },
      })
      .match({ $and: [{ _id: { $ne: {} } }, { _id: { $ne: null } }] })
      .sort("userName");

    // As all the _id don't have the same type, we need to do AGAIN the group by
    const grouped = FTs.reduce((acc, cur) => {
      // @ts-ignore
      if (!acc[cur._id]) {
        // @ts-ignore
        acc[cur._id] = {
          _id: cur._id,
          userName: cur.userName,
          slots: [],
        };
      }
      // @ts-ignore
      acc[cur._id].slots.push(...cur.slots);
      return acc;
    }, {});
    FTs = Object.values(grouped);
  } else {
    const users = await UserModel.find({});
    FTs = users
      .map((user) => {
        return {
          // @ts-ignore
          _id: user._id.toString(),
          userName: user.firstname + " " + user.lastname,
          slots: [],
        };
      })
      .sort(
        (a, b) =>
          0 - (a.userName.toLowerCase() > b.userName.toLowerCase() ? -1 : 1)
      );
  }

  const timespans = await TimeSpanModel.aggregate()
    .match({ assigned: { $ne: null } })
    .lookup({
      from: "fts",
      localField: "FTID",
      foreignField: "count",
      as: "FT",
    })
    .project({
      _id: 0,
      count: "$FTID",
      start: 1,
      end: 1,
      name: { $first: "$FT.general.name" },
      status: "affected",
      assigned: 1,
    })
    .group({
      _id: "$assigned",
      slots: {
        $push: {
          count: "$count",
          name: "$name",
          status: "affected",
          start: "$start",
          end: "$end",
        },
      },
    });

  for (let i = 0; i < FTs.length; i++) {
    timespans
      .filter((ts) => ts._id === FTs[i]._id)
      .forEach((ts) => {
        FTs[i].slots.push(...ts.slots);
      });
  }

  // remove all the FTs with empty slots
  // Usefull as we can't filter by isValid user because it's not set for vehicle
  FTs = FTs.filter((ft) => ft.slots.length > 0);

  // sort slots by start date
  FTs.forEach((ft) => {
    ft.slots.sort((a, b) => 0 - (a.start < b.start ? 1 : -1));
  });

  res.json(FTs);
}