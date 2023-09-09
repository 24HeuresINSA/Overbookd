import { ApiProperty } from "@nestjs/swagger";
import { UserContribution } from "@overbookd/contribution";

export class ContributionResponseDto implements UserContribution {
  @ApiProperty({
    description: "The contribution amount",
    type: Number,
  })
  amount: number;

  @ApiProperty({
    description: "The contribution date",
    type: Date,
  })
  paymentDate: Date;
}
