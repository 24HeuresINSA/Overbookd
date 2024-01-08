import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, ValidateIf } from "class-validator";
import { PrepareSignaForm } from "@overbookd/http";

export class UpdateSignaRequestDto implements PrepareSignaForm {
  @ApiProperty({
    description: "Festival activity location id",
    required: true,
  })
  @IsNumber()
  @ValidateIf((_, value) => value !== null)
  locationId: number | null;
}
