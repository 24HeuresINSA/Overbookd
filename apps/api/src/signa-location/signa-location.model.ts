import { ApiProperty } from "@nestjs/swagger";

export type MapObjectTypes = "POINT" | "ROAD" | "AREA";

export type LatLng = {
  lat: number;
  lng: number;
};

export type MapObject = {
  type: MapObjectTypes;
  coordinates: LatLng[];
};
export interface SignaLocation {
  id: number;
  name: string;
  coordinates: MapObject | null;
}

export class SignaLocationRepresentation implements SignaLocation {
  @ApiProperty({})
  id: number;
  @ApiProperty({})
  name: string;
  @ApiProperty({})
  coordinates: MapObject | null;
}
