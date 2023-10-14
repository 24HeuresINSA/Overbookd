import { ApiProperty } from "@nestjs/swagger";
import { MapObject } from "../signa-location.model";
import { ValidateIf, IsNotEmpty, IsObject, IsString } from "class-validator";

export class UpdateSignaLocationRequestDto {
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
  @IsObject()
  @ValidateIf((_, value) => value !== null)
  coordinates: MapObject | null;
}
