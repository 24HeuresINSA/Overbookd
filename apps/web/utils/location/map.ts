import { Coordinate } from "@overbookd/geo-location";

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
