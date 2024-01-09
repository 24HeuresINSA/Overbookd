import { ApiProperty } from "@nestjs/swagger";
import { Contractor } from "@overbookd/festival-event";

export class ContractorResponseDto implements Contractor {
  @ApiProperty({
    description: "Contractor id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: "Contractor first name",
    type: String,
  })
  firstname: string;

  @ApiProperty({
    description: "Contractor last name",
    type: String,
  })
  lastname: string;

  @ApiProperty({
    description: "Contractor phone number",
    type: String,
  })
  phone: string;

  @ApiProperty({
    description: "Contractor email",
    type: String,
    required: true,
    nullable: true,
  })
  email: string | null;

  @ApiProperty({
    description: "Contractor company",
    type: String,
    required: true,
    nullable: true,
  })
  company: string | null;

  @ApiProperty({
    description: "Comment about the contractor",
    type: String,
    required: true,
    nullable: true,
  })
  comment: string | null;
}
