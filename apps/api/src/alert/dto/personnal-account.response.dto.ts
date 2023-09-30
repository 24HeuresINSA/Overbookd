import { ApiProperty } from "@nestjs/swagger";
import { PersonnalAccountAlert } from "@overbookd/personnal-account";

export class PersonnalAccountResponseDto implements PersonnalAccountAlert {
  @ApiProperty({
    type: String,
    description: "Main alert message",
  })
  summary: string;

  @ApiProperty({
    type: Number,
    description: "Alert explanation and details",
  })
  balance: number;
}
