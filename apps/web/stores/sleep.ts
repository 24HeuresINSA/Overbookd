import {
  isEmpty,
  isOccupied,
  type AboutBed,
  type Bed,
  type EmptyBed,
  type OccupiedBed,
  type Room,
  type Sleeper,
} from "@overbookd/sleep";
import { SleepRepository } from "~/repositories/sleep.repository";
import { isHttpError } from "~/utils/http/http-error.utils";

type State = {
  rooms: Room[];
  beds: Bed[];
  selectedBed?: Bed;
};

export const useSleepStore = defineStore("sleep", {
  state: (): State => ({
    rooms: [],
    beds: [],
    selectedBed: undefined,
  }),
  getters: {
    occupiedBeds(state): OccupiedBed[] {
      return state.beds.filter(isOccupied);
    },
    emptyBeds(state): EmptyBed[] {
      return state.beds.filter(isEmpty);
    },
    allBeds(state): Bed[] {
      return state.beds;
    },
    allSortedBeds(state): OccupiedBed[] {
      console.log(state.beds);
      return state.beds
        .filter(isOccupied)
        .sort(
          (a, b) =>
            new Date(a.sleeper.wakeupTime).getTime() -
            new Date(b.sleeper.wakeupTime).getTime(),
        );
    },
    allRooms(state): Room[] {
      return state.rooms;
    },
  },
  actions: {
    async assignBed(bedId: EmptyBed["id"], sleeper: Sleeper) {
      const res = await SleepRepository.assign(bedId, sleeper);
      if (isHttpError(res)) return;
      await this.fetchAll();
    },
    async fetchAll() {
      const res = await SleepRepository.all();
      if (isHttpError(res)) return;
      this.beds = res;
      this.rooms = getDistinctByName(this.beds.map(({ bed }) => bed.room));
    },
    async createBed(bed: AboutBed) {
      const res = await SleepRepository.create(bed);
      if (isHttpError(res)) return;
      await this.fetchAll();
    },
    async createBedBatch(beds: AboutBed[]) {
      const res = await SleepRepository.createBatch(beds);
      if (isHttpError(res)) return;
      await this.fetchAll();
    },
    async editBed(bedId: Bed["id"], bed: AboutBed, sleeper?: Sleeper) {
      const res = await SleepRepository.edit(bedId, bed, sleeper);
      if (isHttpError(res)) return;
      await this.fetchAll();
    },
    async deleteBed(bedId: EmptyBed["id"]) {
      const res = await SleepRepository.delete(bedId);
      if (isHttpError(res)) return;
      await this.fetchAll();
    },
    async wakeupSleeper(bedId: OccupiedBed["id"]) {
      const res = await SleepRepository.wakeup(bedId);
      if (isHttpError(res)) return;
      await this.fetchAll();
    },
    setSelectedBed(bedId: Bed["id"]) {
      this.selectedBed = this.beds.find(({ id }) => bedId === id);
    },
    clearSelectedBed() {
      this.selectedBed = undefined;
    },
  },
});

function getDistinctByName(rooms: Room[]): Room[] {
  const labels = new Set<string>();
  return rooms.filter(({ label }) => {
    if (labels.has(label)) {
      return false;
    }
    labels.add(label);
    return true;
  });
}
