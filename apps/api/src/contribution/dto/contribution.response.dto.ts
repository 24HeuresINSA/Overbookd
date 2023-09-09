import { ApiProperty } from "@nestjs/swagger";

export class ContributionResponseDto {
  @ApiProperty({
    description: "The contribution amount",
    type: Number,
  })
  amount: number;

  @ApiProperty({
    description: "The contribution date",
    type: Date,
  })
  date: Date;
}
