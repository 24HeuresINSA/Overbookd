import { ApiProperty } from "@nestjs/swagger";
import { Contact } from "@overbookd/festival-event";

export class ContactResponseDto implements Contact {
  @ApiProperty({
    description: "The contact id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: "The contact firstname",
    type: String,
  })
  firstname: string;

  @ApiProperty({
    description: "The contact lastname",
    type: String,
  })
  lastname: string;

  @ApiProperty({
    description: "The contact nickname",
    type: String,
    required: false,
  })
  nickname?: string;

  @ApiProperty({
    description: "The contact phone number",
    type: String,
  })
  phone: string;
}
