import { AdherentWithContribution } from "@overbookd/contribution";
import { AdherentResponseDto } from "./adherent.response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class AdherentWithContributionResponseDto
  extends AdherentResponseDto
  implements AdherentWithContribution
{
  @ApiProperty({
    description: "Contribution amount",
    type: Number,
  })
  amount: number;

  @ApiProperty({
    description: "Contribution payment date",
    type: Date,
  })
  paymentDate: Date;

  @ApiProperty({
    description: "Contribution edition",
    type: Number,
  })
  edition: number;
}
