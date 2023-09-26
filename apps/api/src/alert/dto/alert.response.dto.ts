import { ApiProperty } from "@nestjs/swagger";
import { Alert } from "@overbookd/personnal-account";

export class AlertResponseDto implements Alert {
  @ApiProperty({
    type: String,
    description: "Main alert message",
  })
  summary: string;

  @ApiProperty({
    type: String,
    description: "Alert explanation and details",
  })
  details: string;
}
