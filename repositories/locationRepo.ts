import { NuxtAxiosInstance } from "@nuxtjs/axios";

import { location } from "~/utils/models/repo";
const resource = "/location";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getAllLocations(context: Context) {
    return context.$axios.get(resource);
  },
  getLocationById(context: Context, id: string) {
    return context.$axios.get(resource + `/${id}`);
  },
  deleteLocation(context: Context, id: string) {
    return context.$axios.delete(resource + `/${id}`);
  },
  createNewLocation(context: Context, location: Omit<location, "_id">) {
    //Axios behave strangely with post, we get the data and not the response so strange
    return context.$axios.$post(resource, location);
  },
  updateLocation(context: Context, location: location) {
    return context.$axios.put(resource, location);
  },
  createManyLocations(context: Context, locations: location[]) {
    return context.$axios.$post(resource, locations);
  },
};
