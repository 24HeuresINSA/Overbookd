import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  SignaLocation,
  SignaLocationCreate,
} from "~/utils/models/signaLocation";

const resource = "/signa-location";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getAllSignaLocations(context: Context) {
    return context.$axios.get<SignaLocation[]>(resource);
  },
  getSignaLocationById(context: Context, id: number) {
    return context.$axios.get<SignaLocation>(resource + `/${id}`);
  },
  deleteSignaLocation(context: Context, id: number) {
    return context.$axios.delete<SignaLocation>(resource + `/${id}`);
  },
  createNewSignaLocation(context: Context, signaLocation: SignaLocationCreate) {
    return context.$axios.post<SignaLocation>(resource, signaLocation);
  },
  updateSignaLocation(context: Context, signaLocation: SignaLocation) {
    return context.$axios.put<SignaLocation>(
      resource + `${signaLocation.id}`,
      signaLocation
    );
  },
};
