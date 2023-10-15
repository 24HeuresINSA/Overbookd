import { ApiProperty } from "@nestjs/swagger";
import { PointLocation, RoadLocation, AreaLocation } from "@overbookd/signa";
import {
  ValidateIf,
  IsNotEmpty,
  IsObject,
  IsString,
  IsOptional,
} from "class-validator";

export class UpdateSignaLocationRequestDto {
  @ApiProperty({
    description: "The name of the location",
    example: "Devant les humas",
    required: true,
  })
  @IsOptional()
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
  @IsOptional()
  @IsObject()
  @ValidateIf((_, value) => value !== null)
  geoJson: null | PointLocation | RoadLocation | AreaLocation;
}
