import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsString } from "class-validator";
import { ConfigurationRepresentation } from "../configuration.model";

export class ConfigurationResponseDto implements ConfigurationRepresentation {
  @ApiProperty({
    required: true,
    description:
      "Configuration key, most of the time, correspond to page in the view",
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    required: true,
    description: "Contains Json config object, with arbitrary value",
  })
  @IsObject()
  @IsNotEmpty()
  value: object;
}
