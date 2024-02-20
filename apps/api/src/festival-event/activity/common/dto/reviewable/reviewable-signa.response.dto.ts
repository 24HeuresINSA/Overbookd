import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import { Location, Reviewable, Signage } from "@overbookd/festival-event";
import { LocationResponseDto } from "../../../../common/dto/location.response.dto";
import { LinkedSignageResponseDto } from "../signage.response.dto";
import { UnlinkedSignageResponseDto } from "../signage.response.dto";

type Signa = Reviewable["signa"];
export class SignaResponseDto implements Signa {
  @ApiProperty({ required: true, type: LocationResponseDto })
  location: Location;

  @ApiProperty({
    required: true,
    isArray: true,
    oneOf: [
      { $ref: getSchemaPath(UnlinkedSignageResponseDto) },
      { $ref: getSchemaPath(LinkedSignageResponseDto) },
    ],
  })
  signages: Signage[];
}
