import { ApiProperty } from "@nestjs/swagger";
import {
  AreaLocation,
  PointLocation,
  RoadLocation,
} from "@overbookd/geo-location";
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
} from "class-validator";

export class UpdateLocationRequestDto {
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
  @IsOptional()
  @IsObject()
  @ValidateIf((_, value) => value !== null)
  geoLocation: null | PointLocation | RoadLocation | AreaLocation;
}
