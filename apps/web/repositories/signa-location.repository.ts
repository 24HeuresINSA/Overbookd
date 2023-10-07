import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  SignaLocation,
  SignaLocationCreate,
} from "~/utils/models/signa-location.model";

type Context = { $axios: NuxtAxiosInstance };

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
    signaLocation: SignaLocationCreate,
  ) {
    return context.$axios.post<SignaLocation>(this.basePath, signaLocation);
  }

  static deleteSignaLocation(context: Context, id: number) {
    return context.$axios.delete<SignaLocation>(`${this.basePath}/${id}`);
  }

  static updateSignaLocation(context: Context, signaLocation: SignaLocation) {
    return context.$axios.patch<SignaLocation>(
      `${this.basePath}/${signaLocation.id}`,
      signaLocation,
    );
  }
}
