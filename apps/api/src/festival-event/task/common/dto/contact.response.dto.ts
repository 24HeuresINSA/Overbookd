import { ApiProperty } from "@nestjs/swagger";
import { Contact } from "@overbookd/festival-event";
import { AdherentResponseDto } from "../../../common/dto/adherent.response.dto";

export class ContactResponseDto extends AdherentResponseDto implements Contact {
  @ApiProperty({
    description: "The contact phone number",
    type: String,
  })
  phone: string;
}
