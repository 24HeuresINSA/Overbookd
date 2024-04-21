import { SignaLocation } from "@overbookd/signa";
import { CreateLocation } from "~/utils/models/signa-location.model";
import { Context } from "./context";

export class SignaLocationRepository {
  private static readonly basePath = "signa-location";

  static getAllSignaLocations(context: Context) {
    return context.$axios.get<SignaLocation[]>(this.basePath);
  }

  static getSignaLocationById(context: Context, id: number) {
    return context.$axios.get<SignaLocation>(`${this.basePath}/${id}`);
  }

  static createNewSignaLocation(
    context: Context,
    signaLocation: CreateLocation,
  ) {
    return context.$axios.post<SignaLocation>(this.basePath, signaLocation);
  }

  static updateSignaLocation(context: Context, signaLocation: SignaLocation) {
    return context.$axios.patch<SignaLocation>(
      `${this.basePath}/${signaLocation.id}`,
      signaLocation,
    );
  }

  static deleteSignaLocation(context: Context, id: number) {
    return context.$axios.delete<SignaLocation>(`${this.basePath}/${id}`);
  }
}
