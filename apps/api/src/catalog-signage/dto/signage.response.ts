import { ApiProperty } from "@nestjs/swagger";
import { Signage, SignageType, signageTypes } from "@overbookd/signa";

export class SignageResponseDto implements Signage {
  @ApiProperty({
    description: "The signage id",
  })
  id: number;

  @ApiProperty({
    description: "The signage name",
    example: "Flèche verte",
  })
  name: string;

  @ApiProperty({
    description: "The signage type",
    example: signageTypes.PANNEAU,
  })
  type: SignageType;
}
