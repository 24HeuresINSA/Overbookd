import { ApiProperty } from "@nestjs/swagger";
import { Location } from "@overbookd/festival-event";

export class AppointmentResponseDto implements Location {
  @ApiProperty({
    description: "The appointment id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: "The appointment name",
    type: String,
  })
  name: string;
}
