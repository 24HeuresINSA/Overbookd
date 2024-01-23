import { ApiProperty } from "@nestjs/swagger";
import { Contact } from "@overbookd/festival-event";
import { AddContactForm } from "@overbookd/http";
import { IsNumber } from "class-validator";

export class AddContactRequestDto implements AddContactForm {
  @ApiProperty({
    description: "Id of the contact to add",
    type: Number,
  })
  @IsNumber()
  contactId: Contact["id"];
}
