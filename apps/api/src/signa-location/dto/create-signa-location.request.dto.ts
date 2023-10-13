import { ApiProperty } from "@nestjs/swagger";
import { MapObject } from "../signa-location.model";
import { IsNotEmpty, IsString } from "class-validator";

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
      coordinates: [1, 2],
    },
    required: false,
  })
  coordinates: MapObject | null;
}
