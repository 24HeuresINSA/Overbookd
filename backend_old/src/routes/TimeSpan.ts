import {Request, Response} from "express";
import TimeSpan, {ITimeSpan} from "@entities/TimeSpan";
import FTModel from "@entities/FT";
import {IComment} from "@entities/FA";
import User, {IUser, team} from "@entities/User";
import TimeslotModel from "@entities/Timeslot";
import StatusCodes from "http-status-codes";
import {Document, Types} from "mongoose";
import {dateRangeOverlaps, isTimespanCovered} from "../services/conflict";
import logger from "@shared/Logger";
import {getTeamsToAssignOnEachFT} from "@src/services/FT";
import {getUsersAssignedToTimespans} from "@src/services/timeSpan";

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
  const timespans = await TimeSpan.find({
    FTID: parseInt(req.params.id),
  });
  if (!timespans) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "TimeSpan not found",
    });
  }
  //remove timespans where required.length === 24
  //removes timespan where a user is already assigned
  let filtered = timespans.filter((timespan) =>
    timespan.required!.length === 24 ? false : true
  );

  //remove duplicate timespans
  filtered = filtered.filter(
    (timespan, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.start.getTime() === timespan.start.getTime() &&
          t.end.getTime() === timespan.end.getTime() &&
          t.required === timespan.required &&
          t.FTID === timespan.FTID
      )
  );
  return res.json(filtered);
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
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "User not found",
    });
  }
  if (!(await canUserBeAssignedToTimespan(user, timespan))) {
    return res.status(StatusCodes.CONFLICT).json({
      message: "User already assigned to timespan",
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

  //filter duplicate timespan by every attribute
  availableTimespans = availableTimespans.filter(
    (timespan, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.start.getTime() === timespan.start.getTime() &&
          t.end.getTime() === timespan.end.getTime() &&
          t.required === timespan.required &&
          t.FTID === timespan.FTID
      )
  );
  return res.json(availableTimespans);
}

export async function getAvailableUserForTimeSpan(req: Request, res: Response) {
  const bypass = req.query.bypass === "true";
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

  const usersBool = await Promise.all(
    allUsers.map(async (user) => {
      if (!(await canUserBeAssignedToTimespan(user, timespan))) {
        return false;
      }
      return true;
    })
  );

  let users = allUsers.filter((user, index) => {
    if (!usersBool[index]) {
      return false;
    }

    for (const ts of twinTimespan) {
      if (ts.assigned && ts.assigned.toString() === user._id.toString()) {
        return false;
      }
    }
    //Unsafe role checking
    if (bypass) {
      return true;
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

async function canUserBeAssignedToTimespan(
  user: IUser,
  timespan: ITimeSpan
): Promise<boolean> {
  const userTimespans = await TimeSpan.find({
    assigned: user._id,
  });
  for (const userTS of userTimespans) {
    if (
      dateRangeOverlaps(
        userTS.start.getTime(),
        userTS.end.getTime(),
        timespan.start.getTime(),
        timespan.end.getTime()
      )
    ) {
      return false;
    }
  }
  return true;
}

export async function getUsersAffectedToTimespan(req: Request, res: Response) {
  const timespan = await TimeSpan.findById(req.params.id);
  if (!timespan) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "TimeSpan not found",
    });
  }
  const {start, end, FTID, required} = timespan
  
  const usersAssignedToTimespans = await getUsersAssignedToTimespans({start, end}, required, FTID)

  return res.json(usersAssignedToTimespans);
}

export async function getTotalNumberOfTimespansAndAssignedTimespansByFTID(
  req: Request,
  res: Response
) {
  logger.info(`count for ft id ${req.params.FTID}`);
  const timespans = await TimeSpan.find({ FTID: parseInt(req.params.FTID) });
  const ret = {} as { [key: string]: { total: number; assigned: number } };
  for (const ts of timespans) {
    if (!ret[ts._id.toString()]) {
      ret[ts._id.toString()] = { total: 0, assigned: 0 };
    }
    ret[ts._id.toString()].total++;
    if (ts.assigned) ret[ts._id.toString()].assigned++;
  }

  return res.json(ret);
}

// /rolesByFT
export async function getRolesByFT(req: Request, res: Response) {
  const ftsWithMissingRequiredTeams = await getTeamsToAssignOnEachFT();

  const missingTeamsOnFTs = ftsWithMissingRequiredTeams.reduce(
    (agg, { _id, teams }) => ({ ...agg, [_id.toString()]: teams }),
    {} as { [FTID: string]: team[] }
  );

  return res.json(missingTeamsOnFTs);
}

export async function deleteTimespan(req: Request, res: Response) {
  const timespan = await TimeSpan.findById(req.params.id);
  if (!timespan) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "TimeSpan not found",
    });
  }

  //find ft linked to timespan
  const ft = await FTModel.findOne({ count: timespan.FTID });
  if (!ft) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "FT not found",
    });
  }

  const comment: IComment = {
    time: new Date(),
    topic: "timespan",
    validator:
      res.locals.auth_user.firstname + " " + res.locals.auth_user.lastname,
    text: `Suppression du creneau ${timespan.start.toISOString()} - ${timespan.end.toISOString()} - ${
      timespan.required
    }`,
  };
  ft.comments.push(comment);

  try {
    await ft.save();
  } catch (e) {
    console.log(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error while saving FT",
    });
  }

  await timespan.remove();
  return res.json({
    message: "TimeSpan deleted",
  });
}

export async function unassignAllOfUser(req: Request, res: Response) {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "User not found",
    });
  }
  user.availabilities = [];
  user.team = ["toValidate"];
  await user.save();
  const timespans = await TimeSpan.find({ assigned: user._id });
  for (const ts of timespans) {
    ts.assigned = null;
    await ts.save();
  }

  return res.json({
    message: "User unassigned",
  });
}