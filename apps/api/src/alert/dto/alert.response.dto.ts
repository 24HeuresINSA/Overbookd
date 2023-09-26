import { ApiProperty } from "@nestjs/swagger";
import { Alert } from "@overbookd/personnal-account";

export class AlertResponseDto implements Alert {
  @ApiProperty({
    type: String,
    description: "Main alert message",
  })
  message: string;

  @ApiProperty({
    type: String,
    description: "Alert explanation and description",
  })
  description: string;
}
