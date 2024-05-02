import { ApiProperty } from "@nestjs/swagger";
import {
  PointLocation,
  RoadLocation,
  AreaLocation,
} from "@overbookd/geo-location";
import { SignaLocation } from "@overbookd/signa";

export class SignaLocationRepresentation implements SignaLocation {
  @ApiProperty({})
  id: number;

  @ApiProperty({})
  name: string;

  @ApiProperty({})
  geoLocation: null | PointLocation | RoadLocation | AreaLocation;
}
