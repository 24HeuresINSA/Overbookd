import TimeSpanModel, { Timespan } from "@entities/TimeSpan";
import { BaseEntityService } from "@shared/BaseEntity";
import { Types } from "mongoose";

class TimespanService extends BaseEntityService<Timespan> {
  model = TimeSpanModel;

  findByAssigned = async (
    assigned: string | Types.ObjectId | null
  ): Promise<Timespan[]> => {
    const timeslots = await this.model.find({ assigned });
    return timeslots;
  };

  findByFTID = async (ftid: number): Promise<Timespan[]> => {
    const timeslots = await this.model.find({ ftid });
    return timeslots;
  };

  findNotAssignedIdenticalTimespan = async (
    start: Date,
    end: Date,
    FTID: number,
    required: string
  ): Promise<Timespan[]> => {
    const timeslots = await this.model.find({
      start,
      end,
      assigned: null,
      FTID,
      required,
    });
    return timeslots;
  };
}

const TimespanServiceImplementation = new TimespanService();
export default TimespanServiceImplementation;
