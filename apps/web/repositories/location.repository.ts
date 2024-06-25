import type { CreateLocation } from "@overbookd/http";
import type { SignaLocation } from "@overbookd/signa";
import { HttpClient } from "~/utils/http/http-client";

export class LocationRepository {
  private static readonly basePath = "signa-location";

  static getAllLocations() {
    return HttpClient.get<SignaLocation[]>(this.basePath);
  }

  static getLocationById(id: number) {
    return HttpClient.get<SignaLocation>(`${this.basePath}/${id}`);
  }

  static createNewLocation(signaLocation: CreateLocation) {
    return HttpClient.post<SignaLocation>(this.basePath, signaLocation);
  }

  static updateLocation(signaLocation: SignaLocation) {
    return HttpClient.put<SignaLocation>(
      `${this.basePath}/${signaLocation.id}`,
      signaLocation,
    );
  }

  static deleteLocation(id: number) {
    return HttpClient.delete(`${this.basePath}/${id}`);
  }
}
