import { ApiProperty } from "@nestjs/swagger";
import { UpdateGeneralForm } from "@overbookd/http";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class GeneralRequestDto implements UpdateGeneralForm {
  @ApiProperty({
    description: "Festival task name",
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: "Festival task administrator id",
    required: false,
  })
  @IsNumber()
  @IsOptional()
  administratorId?: number;

  @ApiProperty({
    description: "Festival task team",
    required: false,
  })
  @IsString()
  @IsOptional()
  team?: string;
}
