import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsString } from "class-validator";
import {
  AreaLocation,
  PointLocation,
  RoadLocation,
} from "@overbookd/geo-location";
import { CreateLocation } from "@overbookd/http";

export class CreateLocationRequestDto implements CreateLocation {
  @ApiProperty({
    description: "The name of the location",
    example: "Devant les humas",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "The coordinates of the location",
    example: {
      type: "POINT",
      geoLocation: { lat: 1, lng: 2 },
    },
    required: false,
  })
  @IsObject()
  geoLocation: null | PointLocation | RoadLocation | AreaLocation;
}
