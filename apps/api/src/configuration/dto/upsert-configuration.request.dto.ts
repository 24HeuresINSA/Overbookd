import { ApiProperty } from "@nestjs/swagger";
import { ConfigurationValue } from "../configuration.model";
import { IsNotEmpty, IsObject } from "class-validator";

export class UpsertConfigurationDto implements ConfigurationValue {
  @ApiProperty({
    required: true,
    description: "Contains Json config object, with arbitrary value",
  })
  @IsObject()
  @IsNotEmpty()
  value: object;
}
