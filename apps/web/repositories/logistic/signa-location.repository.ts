import type { CreateLocation } from "@overbookd/http";
import type { SignaLocation } from "@overbookd/signa";
import { HttpClient } from "~/utils/http/http-client";

export class SignaLocationRepository {
  private static readonly basePath = "signa-location";

  static getAllSignaLocations() {
    return HttpClient.get<SignaLocation[]>(this.basePath);
  }

  static getSignaLocationById(id: number) {
    return HttpClient.get<SignaLocation>(`${this.basePath}/${id}`);
  }

  static createNewSignaLocation(signaLocation: CreateLocation) {
    return HttpClient.post<SignaLocation>(this.basePath, signaLocation);
  }

  static updateSignaLocation(signaLocation: SignaLocation) {
    return HttpClient.put<SignaLocation>(
      `${this.basePath}/${signaLocation.id}`,
      signaLocation,
    );
  }

  static deleteSignaLocation(id: number) {
    return HttpClient.delete(`${this.basePath}/${id}`);
  }
}
