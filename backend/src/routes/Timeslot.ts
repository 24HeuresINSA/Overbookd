import { Request, Response } from "express";
import TimeslotModel, { ITimeslot } from "@entities/Timeslot";
import UserModel from "@entities/User";
import StatusCodes from "http-status-codes";
import logger from "@shared/Logger";
import { Types } from "mongoose";

export async function getTimeslot(req: Request, res: Response) {
  const availabilities = await TimeslotModel.find({});
  res.json(availabilities);
}

export async function getTimeslotById(req: Request, res: Response) {
  const { id } = req.params;
  logger.info(id)
  const timeslot = await TimeslotModel.findById(id);
  if (!timeslot) {
    logger.info(`Timeslot with id ${id} not found`);
    res.status(StatusCodes.NOT_FOUND).json({
      message: `Timeslot with id ${id} not found`
    });
  }
  res.json(timeslot);
}

export async function updateTimeslot(req: Request, res: Response) {
  const mAvailabilities = <ITimeslot>req.body;
  if (mAvailabilities._id === undefined) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Availabilities must contain an ID" });
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
      .json({ error: "Timeslots must contain at least one timeslot" });
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
  res.sendStatus(StatusCodes.CREATED)
}

export async function updateTimeslotCharisma(req: Request, res: Response) {
  const { id, charisma } = req.params;
  const charismaN = parseInt(charisma);
  logger.info(`updating Timeslot ${id}`);
  const timeslot = await TimeslotModel.findById(id);
  if (timeslot && !isNaN(charismaN)) {
    timeslot.charisma = charismaN;
    timeslot.save();
  }else{
    res.status(StatusCodes.BAD_REQUEST).json({
      message: `Timeslot with id ${id} not found or charisma NaN`
    });
  }
  res.status(StatusCodes.OK).json(timeslot);
}

export async function deleteTimeslot(req: Request, res: Response) {
  const { id } = req.params;
  logger.info(`deleting Timeslot ${id}`);
  const timeslot = await TimeslotModel.findById(id);
  if (!timeslot) {
    logger.info(`Timeslot with id ${id} not found`);
    return res.status(StatusCodes.NOT_FOUND).json({
      message: `Timeslot with id ${id} not found`
    });
  }
  const users = await UserModel.find({availabilities: {$in: [Types.ObjectId(id)]}}).exec();
  users.forEach(async user => {
    user.availabilities = user.availabilities!.filter(availability => availability.toString() !== id);
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

export async function deleteManyTimeslotsByGroupTitle(req: Request, res: Response) {
  const { groupTitle } = req.params;
  logger.info(`deleting Timeslots with groupTitle :  ${groupTitle}`);
  const timeslots = await TimeslotModel.find({groupTitle});
  if (!timeslots) {
    logger.info(`Timeslot with groupTitle ${groupTitle} not found`);
    return res.status(StatusCodes.NOT_FOUND).json({
      message: `Timeslot with groupTitle ${groupTitle} not found`
    });
  }
  //Delete related entry in users as well as timeslot
  const users = await UserModel.find({availabilities: {$in: timeslots.map(timeslot => timeslot._id)}}).exec();
  for(const timeslot of timeslots){
    for(const user of users){
      user.availabilities = user.availabilities!.filter(availability => availability.toString() !== timeslot._id.toString());
      await user.save();
    }
    await timeslot.remove();
  }
  res.sendStatus(StatusCodes.OK);
}