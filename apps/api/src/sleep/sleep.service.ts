import {
  BedManaging,
  EmptyBed,
  OccupiedBed,
  Sleeper,
  Bed,
  AboutBed,
} from "@overbookd/sleep";

export class SleepService {
  constructor(private readonly bedManaging: BedManaging) {}

  async wakeup(bedId: number): Promise<EmptyBed> {
    return await this.bedManaging.wakeup(bedId);
  }

  async assignBedToSleeper(
    bedId: number,
    sleeper: Sleeper,
  ): Promise<OccupiedBed> {
    return await this.bedManaging.assignBedToSleeper(bedId, sleeper);
  }

  async findAll(): Promise<Bed[]> {
    return await this.bedManaging.findAll();
  }

  async createBed(bed: AboutBed): Promise<EmptyBed> {
    return await this.bedManaging.createBed(bed);
  }

  async createBedBatch(beds: AboutBed[]): Promise<EmptyBed[]> {
    return await this.bedManaging.createBedBatch(beds);
  }

  async editBed(bedId: number, bed: AboutBed, sleeper?: Sleeper): Promise<Bed> {
    return await this.bedManaging.editBed(bedId, bed, sleeper);
  }

  async deleteBed(bedId: EmptyBed["id"]): Promise<void> {
    return await this.bedManaging.deleteBed(bedId);
  }
}
