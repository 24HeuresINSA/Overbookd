import { SignaLocation, Coordinate } from "@overbookd/signa";

export type CreateLocation = Pick<SignaLocation, "name" | "geoJson">;

export const mapConfiguration: {
  url: string;
  attribution: string;
  zoom: number;
  center: Coordinate;
} = {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  zoom: 16,
  center: {
    lat: 45.784045,
    lng: 4.876916,
  },
};
