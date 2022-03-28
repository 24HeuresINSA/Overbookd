import { Request, Response } from "express";
import TimeSpan from "@entities/TimeSpan";
import User from "@entities/User";
import TimeslotModel from "@entities/Timeslot";
import StatusCodes from "http-status-codes";
import { Types } from "mongoose";
import { dateRangeOverlaps, isTimespanCovered } from "../services/conflict";

export async function getAllTimeSpan(req: Request, res: Response) {
  const timespan = await TimeSpan.find({});
  return res.json(timespan);
}

export async function getTimeSpanById(req: Request, res: Response) {
  const timespan = await TimeSpan.findById(req.params.id);
  if (!timespan) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "TimeSpan not found",
    });
  }
  return res.json(timespan);
}

//get timespan where assigned is userid
export async function getTimeSpanByAssigned(req: Request, res: Response) {
  const timespan = await TimeSpan.find({ assigned: req.params.id });
  if (!timespan) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "TimeSpan not found",
    });
  }
  return res.json(timespan);
}

/*
 assign user to a timespan
 /timespan/:id/user/:userId
 */
export async function assignUserToTimeSpan(req: Request, res: Response) {
  const timespan = await TimeSpan.findById(req.params.id);
  if (!timespan) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "TimeSpan not found",
    });
  }
  timespan.assigned = Types.ObjectId(req.params.userId);
  await timespan.save();
  return res.json(timespan);
}

/*
 unassign user from a timespan
 /timespan/:id/unassign
 */
export async function unassignUserFromTimeSpan(req: Request, res: Response) {
  const timespan = await TimeSpan.findById(req.params.id);
  if (!timespan) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "TimeSpan not found",
    });
  }
  timespan.assigned = null;
  await timespan.save();
  return res.json(timespan);
}

// Find all timespan where user is not assigned and other timespan does not intersect with the timespans where user is assigned
export async function getAvailableTimeSpan(req: Request, res: Response) {
  const timespans = await TimeSpan.find({
    assigned: null,
  });
  const assignedTimespans = await TimeSpan.find({
    assigned: req.params.userId,
  });
  const user = await User.findById(req.params.userId);
  if (!user || !user.availabilities) {
    return res.json([]);
  }
  //fetch user timeslot
  const userAvailabilities = await TimeslotModel.find({
    _id: { $in: user.availabilities },
  }).lean();

  let availableTimespans = timespans.filter(
    (timespan) =>
      !assignedTimespans.some((assignedTimespan) =>
        dateRangeOverlaps(
          timespan.start.getTime(),
          timespan.end.getTime(),
          assignedTimespan.start.getTime(),
          assignedTimespan.end.getTime()
        )
      )
  );

  availableTimespans = availableTimespans.filter(
    (timespan) => {
      if (timespan.required && timespan.required.length < 24) {
        const requiredTeam = timespan.required;
        if(requiredTeam === "soft"){
          if(user.team && (user.team.includes(requiredTeam) || user.team.includes("hard") || user.team.includes("confiance"))){
            return true;
          }
        }
        if(requiredTeam === "confiance"){
          if(user.team && (user.team.includes(requiredTeam) || user.team.includes("hard"))){
            return true;
          }
        }
        if(user.team && user.team.includes(requiredTeam)) {
          return true;
        }
      }
    }
  );

  //verify if timespan is covered by user timeslot
  availableTimespans = availableTimespans.filter((timespan) => {
    return isTimespanCovered(timespan, userAvailabilities);
  });

  //fiter duplicate timespan by every attribute
  availableTimespans = availableTimespans.filter(
    (timespan, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.start.getTime() === timespan.start.getTime() &&
          t.end.getTime() === timespan.end.getTime() &&
          t.required === timespan.required
      )
  );
  return res.json(availableTimespans);
}
