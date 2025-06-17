import { AboutBed, Bed, EmptyBed, OccupiedBed, Sleeper } from "./bed.model.js";

export abstract class SleepBuilder {
  protected constructor(readonly id: number) {}

  abstract assignTo(sleeper: Sleeper): SleepBuilder;
}

export type Beds = {
  wakeup(bedId: OccupiedBed["id"]): Promise<EmptyBed>;
  assign(bedId: EmptyBed["id"], sleeper: Sleeper): Promise<OccupiedBed>;
  create(bed: AboutBed): Promise<EmptyBed>;
  createBatch(beds: AboutBed[]): Promise<EmptyBed[]>;
  edit(bedId: number, bed: AboutBed, sleeper?: Sleeper): Promise<Bed>;
  delete(bedId: EmptyBed["id"]): Promise<void>;
  list(): Promise<Bed[]>;
};

export class BedManaging {
  constructor(private beds: Beds) {}

  async wakeup(bedId: number): Promise<EmptyBed> {
    return this.beds.wakeup(bedId);
  }

  async assignBedToSleeper(
    bedId: number,
    sleeper: Sleeper,
  ): Promise<OccupiedBed> {
    return this.beds.assign(bedId, sleeper);
  }

  async findAll(): Promise<Bed[]> {
    return this.beds.list();
  }

  async createBed(bed: AboutBed): Promise<EmptyBed> {
    return this.beds.create(bed);
  }

  async createBedBatch(beds: AboutBed[]): Promise<EmptyBed[]> {
    return this.beds.createBatch(beds);
  }

  async editBed(bedId: number, bed: AboutBed, sleeper?: Sleeper): Promise<Bed> {
    return this.beds.edit(bedId, bed, sleeper);
  }

  async deleteBed(bedId: EmptyBed["id"]): Promise<void> {
    return this.beds.delete(bedId);
  }
}
