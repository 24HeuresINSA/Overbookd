import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsString } from "class-validator";
import { PointLocation, RoadLocation, AreaLocation } from "@overbookd/signa";

export class CreateSignaLocationRequestDto {
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
      geoJson: { lat: 1, lng: 2 },
    },
    required: false,
  })
  @IsObject()
  geoJson: null | PointLocation | RoadLocation | AreaLocation;
}
