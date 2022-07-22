import TimeslotMode, { Timeslot } from "@entities/Timeslot";
import { Types } from "mongoose";

export const findAll = async (): Promise<Timeslot[]> => {
  return TimeslotMode.find();
};

export const findById = async (
  id: string | Types.ObjectId
): Promise<Timeslot> => {
  const timeslot = await TimeslotMode.findById(id);
  if (!timeslot) {
    throw new Error("Timeslot not found");
  }
  return timeslot;
};

export const findManyByIds = async (
  ids: string[] | Types.ObjectId[]
): Promise<Timeslot[]> => {
  const timeslots = await TimeslotMode.find({ _id: { $in: ids } });
  if (timeslots.length !== ids.length) {
    throw new Error("Timeslots not found");
  }
  return timeslots;
};

export const save = async (timeslot: Timeslot): Promise<Timeslot> => {
  return TimeslotMode.create(timeslot);
};

export const update = async (
  id: string | Types.ObjectId,
  timeslot: Timeslot
): Promise<Timeslot> => {
  const updatedTimeslot = await TimeslotMode.findByIdAndUpdate(id, timeslot, {
    new: true,
  });
  if (!updatedTimeslot) {
    throw new Error("Timeslot not found");
  }
  return updatedTimeslot;
};
