import { ApiProperty } from "@nestjs/swagger";
import { Consumer } from "../user.model";
import { UserPersonnalDataResponseDto } from "./user-personnal-data.response.dto";

export class ConsumerResponseDto
  extends UserPersonnalDataResponseDto
  implements Consumer
{
  @ApiProperty({
    description: "Consumer balance",
    type: Number,
  })
  balance: number;
}
