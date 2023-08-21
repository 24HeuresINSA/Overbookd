import { ApiProperty } from "@nestjs/swagger";
import { Period } from "../../gear-request/gear-request.model";
import {
  PublicAnimationWithFa,
  PublicAnimationFa,
} from "../public-animation.model";
import { PublicAnimationResponseDto } from "./public-animation.response.dto";

class PeriodRepresentation implements Period {
  @ApiProperty({})
  id: number;
  @ApiProperty({})
  start: Date;
  @ApiProperty({})
  end: Date;
}

class PublicAnimationRepresentation implements PublicAnimationFa {
  @ApiProperty({})
  id: number;
  @ApiProperty({})
  name: string;
  @ApiProperty({ isArray: true, type: PeriodRepresentation })
  timeWindows: Period[];
}

export class PublicAnimationWithFaResponseDto
  extends PublicAnimationResponseDto
  implements PublicAnimationWithFa
{
  @ApiProperty({
    required: true,
    description: "The fa linked",
    type: PublicAnimationRepresentation,
  })
  fa: PublicAnimationFa;
}
