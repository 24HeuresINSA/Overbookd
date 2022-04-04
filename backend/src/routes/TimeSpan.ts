import { Request, Response } from "express";
import TimeSpan from "@entities/TimeSpan";
import User, { IUser } from "@entities/User";
import TimeslotModel from "@entities/Timeslot";
import StatusCodes from "http-status-codes";
import { Types, Document } from "mongoose";
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

//get timespan by FTID
export async function getTimeSpanByFTID(req: Request, res: Response) {
  const timespan = await TimeSpan.find({ FTID: parseInt(req.params.id) });
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
  let oneAssigned = false;
  if (!timespan.assigned) {
    timespan.assigned = Types.ObjectId(req.params.userId);
    await timespan.save();
    oneAssigned = true;
  } else {
    //find all identical timespans and assign user to one of them
    const timespans = await TimeSpan.find({
      start: timespan.start,
      end: timespan.end,
      assigned: null,
      FTID: timespan.FTID,
      required: timespan.required,
    });
    for (const ts of timespans) {
      if (!ts.assigned) {
        ts.assigned = Types.ObjectId(req.params.userId);
        oneAssigned = true;
        await ts.save();
        return res.json(timespan);
      }
    }
  }
  if (!oneAssigned) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "No timespan available",
    });
  }
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
  //filter by teams
  availableTimespans = availableTimespans.filter((timespan) => {
    if (timespan.required && timespan.required.length < 24) {
      const requiredTeam = timespan.required;
      if (requiredTeam === "soft") {
        if (
          user.team &&
          (user.team.includes(requiredTeam) ||
            user.team.includes("hard") ||
            user.team.includes("confiance"))
        ) {
          return true;
        }
      }
      if (requiredTeam === "confiance") {
        if (
          user.team &&
          (user.team.includes(requiredTeam) || user.team.includes("hard"))
        ) {
          return true;
        }
      }
      if (user.team && user.team.includes(requiredTeam)) {
        return true;
      }
    }
  });

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

export async function getAvailableUserForTimeSpan(req: Request, res: Response) {
  const timespan = await TimeSpan.findById(req.params.id);
  if (!timespan) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "TimeSpan not found",
    });
  }
  const twinTimespan = await TimeSpan.find({
    start: timespan.start,
    end: timespan.end,
    FTID: timespan.FTID,
    required: timespan.required,
  });
  const allUsers = await User.find({});
  //find all users who can be assigned to this timespan
  let users = allUsers.filter((user) => {
    for (const ts of twinTimespan) {
      if (ts.assigned && ts.assigned.toString() === user._id.toString()) {
        return false;
      }
    }
    if (timespan.required && timespan.required === "soft") return true;
    if (
      timespan.required &&
      timespan.required === "confiance" &&
      (user.team?.includes("hard") || user.team?.includes("confiance"))
    )
      return true;
    if (user.team && user.team.includes(timespan.required!)) {
      return true;
    }
  });

  //verify if users is available for this timespan
  users = (await filter(users, async (user: IUser) => {
    //fetch user timeslot
    const userAvailabilities = await TimeslotModel.find({
      _id: { $in: user.availabilities },
    }).lean();
    return isTimespanCovered(timespan, userAvailabilities);
  })) as (IUser & Document<any, any, IUser>)[];
  return res.json(users);
}

//helper function for the one just above
async function filter(arr: Array<unknown>, callback: any): Promise<unknown[]> {
  const fail = Symbol();
  return (
    await Promise.all(
      arr.map(async (item) => ((await callback(item)) ? item : fail))
    )
  ).filter((i) => i !== fail);
}
