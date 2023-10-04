import { ApiProperty } from "@nestjs/swagger";
import { Consumer } from "../user.model";
import { UserPersonalDataResponseDto } from "./user-personal-data.response.dto";

export class ConsumerResponseDto
  extends UserPersonalDataResponseDto
  implements Consumer
{
  @ApiProperty({
    description: "Consumer balance",
    type: Number,
  })
  balance: number;
}
