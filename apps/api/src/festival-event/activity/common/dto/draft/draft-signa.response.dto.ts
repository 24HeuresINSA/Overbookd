import { ApiProperty } from "@nestjs/swagger";
import { Draft, Signage, Location } from "@overbookd/festival-event";
import { UnlinkedSignageResponseDto } from "../signage.response.dto";
import { LocationResponseDto } from "../../../../common/dto/location.response.dto";

export type Signa = Draft["signa"];
export class SignaDto implements Signa {
  @ApiProperty({
    description: "Define where this festival activity take place",
    required: true,
    nullable: true,
    type: LocationResponseDto,
  })
  location: Location | null;

  @ApiProperty({
    description: "Festival activity signages needed",
    isArray: true,
    type: UnlinkedSignageResponseDto,
  })
  signages: Signage[];
}
