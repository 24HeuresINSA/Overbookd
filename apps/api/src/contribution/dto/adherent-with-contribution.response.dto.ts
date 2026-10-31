import {
  AdherentWithContribution,
  contributionTypes,
  type ContributionType,
} from "@overbookd/contribution";
import { ContributionAdherentResponseDto } from "./adherent.response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class AdherentWithContributionResponseDto
  extends ContributionAdherentResponseDto
  implements AdherentWithContribution
{
  @ApiProperty({
    description: "Contribution type",
    enum: contributionTypes,
  })
  type: ContributionType;

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
