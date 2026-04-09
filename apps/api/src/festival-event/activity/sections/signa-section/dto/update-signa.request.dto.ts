import { ApiProperty } from "@nestjs/swagger";
import { PrepareSignaForm } from "@overbookd/http";
import { IsNumber, ValidateIf } from "class-validator";

export class UpdateSignaRequestDto implements PrepareSignaForm {
  @ApiProperty({
    description: "Festival activity location id",
    required: true,
  })
  @IsNumber()
  @ValidateIf((_, value) => value !== null)
  locationId: number | null;
}
