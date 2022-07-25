import TimeSpanModel, { Timespan } from "@entities/TimeSpan";
import { team } from "@entities/User";
import { Types } from "mongoose";

export async function getTimespansWhereUserIsAssigned(
  userId: Types.ObjectId,
  range: { start: number; end: number },
  excludeFTs: number[] = []
): Promise<Timespan[]> {
  const matchQuery = {
    FTID: {
      $nin: excludeFTs,
    },
    assigned: userId.toString(),
    start: {
      $lt: new Date(range.end),
    },
    end: {
      $gt: new Date(range.start),
    },
  };

  const timespans = await TimeSpanModel.find(matchQuery);

  return timespans;
}

declare interface UserAssignedToTimespan {
  user: {
    lastname: string;
    firstname: string;
    _id: Types.ObjectId;
  };
  _id: Types.ObjectId;
}

export async function getUsersAssignedToTimespans(
  range: { start: Date; end: Date },
  team: team,
  FTID: number
): Promise<UserAssignedToTimespan[]> {
  const { start, end } = range;
  const matchQuery = {
    start,
    end,
    required: team,
    FTID,
    assigned: { $ne: null },
  };

  return TimeSpanModel.aggregate()
    .match(matchQuery)
    .addFields({ assignedUserId: { $toObjectId: "$assigned" } })
    .lookup({
      from: "users",
      localField: "assignedUserId",
      foreignField: "_id",
      as: "user",
    })
    .unwind({ path: "$user" })
    .project({
      _id: 1,
      "user.firstname": 1,
      "user.lastname": 1,
      "user._id": 1,
    });
}
