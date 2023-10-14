import { SignaLocation } from "@overbookd/signa";

export type CreateLocation = Pick<SignaLocation, "name" | "geoJson">;
