import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { PrepareInChargeForm } from "@overbookd/http";

export class InChargeRequestDto implements PrepareInChargeForm {
  @ApiProperty({
    description: "Festival activity adherent id in charge",
    required: false,
  })
  @IsOptional()
  adherentId?: number;

  @ApiProperty({
    description: "Festival activity team in charge",
    required: false,
  })
  @IsOptional()
  team?: string;
}
