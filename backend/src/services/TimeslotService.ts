import TimeslotModel, { Timeslot } from "@entities/Timeslot";
import { BaseEntityService } from "@shared/BaseEntity";

class TimeslotService extends BaseEntityService<Timeslot> {
  model = TimeslotModel;
}

const TimeslotServiceImplementation = new TimeslotService();
export default TimeslotServiceImplementation;
