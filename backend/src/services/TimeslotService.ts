import TimeslotModel, { Timeslot } from "@entities/Timeslot";
import { BaseEntityService } from "@shared/BaseEntity";
import { Types } from "mongoose";

declare interface OrgaNeedsUserCount {
  _id: Types.ObjectId;
  timeFrame: {
    start: Date;
    end: Date;
  };
  groupTitle: string;
  countUsers: number;
  countValidUsers: number;
}

class TimeslotService extends BaseEntityService<Timeslot> {
  model = TimeslotModel;

  findByGrouptTitle = async (groupTitle: string): Promise<Timeslot[]> => {
    const timeslots = await this.model.find({ groupTitle });
    return timeslots;
  };

  //Used in page Organeeds (Besoins Orgas)
  getOrgaNeedsUserCount = async (
    start: Date,
    end: Date
  ): Promise<OrgaNeedsUserCount[]> => {
    const timeslots = await TimeslotModel.aggregate()
      .match({
        "timeFrame.start": { $gte: start },
        "timeFrame.end": { $lte: end },
      })
      .lookup({
        from: "users",
        localField: "_id",
        foreignField: "availabilities",
        as: "users",
      })
      .project({
        _id: 1,
        timeFrame: 1,
        groupTitle: 1,
        countUsers: { $size: "$users" },
        countValidUsers: {
          $size: {
            $filter: {
              input: "$users",
              as: "user",
              cond: { $eq: ["$$user.isValid", true] },
            },
          },
        },
      });

    return timeslots;
  };
}

const TimeslotServiceImplementation = new TimeslotService();
export default TimeslotServiceImplementation;
