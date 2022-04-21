import {Request, Response} from "express";
import TimeslotModel, {ITimeslot} from "@entities/Timeslot";
import UserModel from "@entities/User";
import StatusCodes from "http-status-codes";
import logger from "@shared/Logger";
import {Types} from "mongoose";
import FTModel from "@entities/FT";
import TimeSpanModel from "@entities/TimeSpan";

export async function getTimeslot(req: Request, res: Response) {
  const availabilities = await TimeslotModel.find({});
  res.json(availabilities);
}

export async function getTimeslotById(req: Request, res: Response) {
  const {id} = req.params;
  logger.info(id);
  const timeslot = await TimeslotModel.findById(id);
  if (!timeslot) {
    logger.info(`Timeslot with id ${id} not found`);
    res.status(StatusCodes.NOT_FOUND).json({
      message: `Timeslot with id ${id} not found`,
    });
  }
  res.json(timeslot);
}

export async function updateTimeslot(req: Request, res: Response) {
  const mAvailabilities = <ITimeslot>req.body;
  if (mAvailabilities._id === undefined) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({error: "Availabilities must contain an ID"});
  }
  // @ts-ignore
  await AvailabilitiesModel.findByIdAndUpdate(
    mAvailabilities._id,
    // @ts-ignore
    mAvailabilities
  );
  res.sendStatus(StatusCodes.OK);
}

export async function createManyTimeslots(req: Request, res: Response) {
  const timeslots = req.body;
  if (timeslots.length === 0) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({error: "Timeslots must contain at least one timeslot"});
  }
  const newTimeslots = await TimeslotModel.insertMany(timeslots);
  res.status(StatusCodes.OK).json(newTimeslots);
}

export async function createTimeslot(req: Request, res: Response) {
  //Add validation on time
  const mTimeslot = <ITimeslot>req.body;
  // creating Equipment
  logger.info(`creating Timeslot ${mTimeslot.groupTitle}`);
  await TimeslotModel.create(mTimeslot);
  res.sendStatus(StatusCodes.CREATED);
}

export async function updateTimeslotCharisma(req: Request, res: Response) {
  const {id, charisma} = req.params;
  const charismaN = parseInt(charisma);
  logger.info(`updating Timeslot ${id}`);
  const timeslot = await TimeslotModel.findById(id);
  if (timeslot && !isNaN(charismaN)) {
    timeslot.charisma = charismaN;
    timeslot.save();
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: `Timeslot with id ${id} not found or charisma NaN`,
    });
  }
  res.status(StatusCodes.OK).json(timeslot);
}

export async function deleteTimeslot(req: Request, res: Response) {
  const {id} = req.params;
  logger.info(`deleting Timeslot ${id}`);
  const timeslot = await TimeslotModel.findById(id);
  if (!timeslot) {
    logger.info(`Timeslot with id ${id} not found`);
    return res.status(StatusCodes.NOT_FOUND).json({
      message: `Timeslot with id ${id} not found`,
    });
  }
  const users = await UserModel.find({
    availabilities: {$in: [Types.ObjectId(id)]},
  }).exec();
  users.forEach(async (user) => {
    user.availabilities = user.availabilities!.filter(
      (availability) => availability.toString() !== id
    );
    await user.save();
  });
  // if (users.length>0) {
  //   logger.info(`Timeslot with id ${id} has users`);
  //   return res.status(StatusCodes.BAD_REQUEST).json({
  //     message: `Timeslot with id ${id} has users`
  //   });
  // }
  timeslot.remove();
  res.sendStatus(StatusCodes.OK);
}

export async function deleteManyTimeslotsByGroupTitle(
  req: Request,
  res: Response
) {
  const {groupTitle} = req.params;
  logger.info(`deleting Timeslots with groupTitle :  ${groupTitle}`);
  const timeslots = await TimeslotModel.find({groupTitle});
  if (!timeslots) {
    logger.info(`Timeslot with groupTitle ${groupTitle} not found`);
    return res.status(StatusCodes.NOT_FOUND).json({
      message: `Timeslot with groupTitle ${groupTitle} not found`,
    });
  }
  //Delete related entry in users as well as timeslot
  const users = await UserModel.find({
    availabilities: {$in: timeslots.map((timeslot) => timeslot._id)},
  }).exec();
  for (const timeslot of timeslots) {
    for (const user of users) {
      user.availabilities = user.availabilities!.filter(
        (availability) => availability.toString() !== timeslot._id.toString()
      );
      await user.save();
    }
    await timeslot.remove();
  }
  res.sendStatus(StatusCodes.OK);
}

// Return the number of users available and require for each 15 minutes timeslot of the given day (start of the day)
export async function getOrgaNeeds(req: Request, res: Response) {
  const timestamp: number = +(req.params['timestamp']);
  const start = new Date(timestamp);
  const end = new Date(timestamp + 86400000); // The end is the start + 1 day in seconds
  logger.info(`getting Timeslots for Timeslot ${timestamp}`);

  // Creating all the 15 minutes timeslots
  let smallTimeslots: Array<{
    id: number,
    start: Date,
    availableCount: number,
    availableValidCount: number,
    requireCount: number,
    requireValidatedCount: number
    affectedCount: number
  }> = [];
  for (let i = 0; i < 96; i++) {
    smallTimeslots.push({
      id: i,
      start: new Date(start.getTime() + i * 900000),
      availableCount: 0,
      availableValidCount: 0,
      requireCount: 0,
      requireValidatedCount: 0,
      affectedCount: 0
    });
  }

  // Filling the users count
  const timeslots = await TimeslotModel.aggregate()
    .match({
      'timeFrame.start': {$gte: start},
      'timeFrame.end': {$lte: end},
    })
    .lookup({
      from: 'users',
      localField: '_id',
      foreignField: 'availabilities',
      as: 'users',
    })
    .project({
      _id: 1,
      timeFrame: 1,
      groupTitle: 1,
      countUsers: {$size: '$users'},
      countValidUsers: {
        $size: {
          $filter: {
            input: '$users',
            as: 'user',
            cond: {$eq: ['$$user.isValid', true]},
          },
        },
      },
    });

  timeslots.forEach(elem => {
    for (let i = 0; i < 8; i++) {
      const index = smallTimeslots.findIndex(smallTimeslot => {
        return smallTimeslot.start.getTime() === elem.timeFrame.start.getTime() + i * 900000;
      });
      if (index !== -1) {
        smallTimeslots[index].availableCount = elem.countUsers;
        smallTimeslots[index].availableValidCount = elem.countValidUsers;
      }
    }
  });

  // Filling the require count
  const required = await FTModel.aggregate()
    .match({
      $and: [{isValid: {$ne: false}}],
    })
    .project({
      status: 1,
      timeframes: 1
    })
    .unwind('$timeframes')
    .unwind('$timeframes.required');

  smallTimeslots.forEach((timeslot) => {
    const requiredForTimeslot = required.filter(
      (ft) =>
        new Date(ft.timeframes.start) <= timeslot.start &&
        new Date(ft.timeframes.end) >= new Date(timeslot.start.getTime() + 900000)
    );
    // requireCount is the number of users required for the timeslot
    timeslot.requireCount = requiredForTimeslot.reduce((acc, ft) => {
      if (ft.timeframes.required.type === 'user') {
        return acc + 1;
      } else {
        return acc + ft.timeframes.required.amount;
      }
    }, 0);
    timeslot.requireValidatedCount = requiredForTimeslot.filter((ft) => ft.status === "validated" || ft.status === "ready")
      .reduce((acc, ft) => {
        if (ft.timeframes.required.type === 'user') {
          return acc + 1;
        } else {
          return acc + ft.timeframes.required.amount;
        }
      }, 0);
  });

  // Filling the affected count
  const affected = await TimeSpanModel.aggregate()
    .match({
      start: {$gte: start},
      end: {$lte: end},
      assigned: {$ne: null},
    });

  smallTimeslots.forEach((timeslot) => {
    const affectedForTimeslot = affected.filter(
      (timespan) =>
        new Date(timespan.start) <= timeslot.start &&
        new Date(timespan.end) >= new Date(timeslot.start.getTime() + 900000)
    );
    timeslot.affectedCount = affectedForTimeslot.length;
  });

  return res.json(smallTimeslots);
}