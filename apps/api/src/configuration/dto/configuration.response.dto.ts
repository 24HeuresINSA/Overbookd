import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsObject } from "class-validator";
import {
  Configuration,
  ConfigurationKey,
  configurationKeys,
} from "@overbookd/configuration";

export class ConfigurationResponseDto implements Configuration {
  @ApiProperty({
    required: true,
    description:
      "Configuration key, most of the time, correspond to page in the view",
  })
  @IsEnum(configurationKeys, { message: () => "La clé est invalide" })
  @IsNotEmpty()
  key: ConfigurationKey;

  @ApiProperty({
    required: true,
    description: "Contains Json config object, with arbitrary value",
  })
  @IsObject()
  @IsNotEmpty()
  value: object;
}
