import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject } from "class-validator";

export class UpsertConfigurationDto {
  @ApiProperty({
    required: true,
    description: "Contains Json config object, with arbitrary value",
  })
  @IsObject()
  @IsNotEmpty()
  value: object;
}
