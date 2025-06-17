import {
  type AboutBed,
  type Bed,
  type EmptyBed,
  type OccupiedBed,
  type Sleeper,
} from "@overbookd/sleep";
import { HttpClient } from "~/utils/http/http-client";

export class SleepRepository {
  private static readonly basePath = "sleep";

  static wakeup(bedId: OccupiedBed["id"]) {
    return HttpClient.post<EmptyBed>(`${this.basePath}/wakeup/${bedId}`);
  }

  static all() {
    return HttpClient.get<Bed[]>(this.basePath);
  }

  static create(bed: AboutBed) {
    return HttpClient.post<EmptyBed>(this.basePath, bed);
  }

  static createBatch(beds: AboutBed[]) {
    return HttpClient.post<EmptyBed[]>(`${this.basePath}/batch`, beds);
  }

  static edit(bedId: Bed["id"], bed: AboutBed, sleeper?: Sleeper) {
    return HttpClient.put<EmptyBed>(`${this.basePath}/${bedId}`, {
      bed,
      sleeper,
    });
  }

  static delete(bedId: EmptyBed["id"]) {
    return HttpClient.delete<void>(`${this.basePath}/${bedId}`);
  }

  static assign(bedId: EmptyBed["id"], sleeper: Sleeper) {
    return HttpClient.post<OccupiedBed>(
      `${this.basePath}/rest/${bedId}`,
      sleeper,
    );
  }
}
