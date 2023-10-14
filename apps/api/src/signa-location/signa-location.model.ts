import { ApiProperty } from "@nestjs/swagger";
import { SignaLocation, PointLocation, RoadLocation, AreaLocation } from "@overbookd/signa";

export class SignaLocationRepresentation implements SignaLocation {
  @ApiProperty({})
  id: number;
  @ApiProperty({})
  name: string;
  @ApiProperty({})
  geoJson: null | PointLocation | RoadLocation | AreaLocation;
}
