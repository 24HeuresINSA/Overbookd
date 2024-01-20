import { ApiProperty } from "@nestjs/swagger";
import { FestivalTask } from "@overbookd/festival-event";
import { AppointmentResponseDto } from "../appointment.response.dto";
import { ContactResponseDto } from "../contact.response.dto";
import { AdherentResponseDto } from "../adherent.response.dto";

type DraftInstructions = FestivalTask["instructions"];
type InCharge = DraftInstructions["inCharge"];

class InChargeDto implements InCharge {
  @ApiProperty({
    description: "The draft instructions in charge volunteers",
    type: AdherentResponseDto,
    isArray: true,
  })
  volunteers: InCharge["volunteers"];

  @ApiProperty({
    description: "The draft instructions in charge instruction",
    type: String,
  })
  instruction: InCharge["instruction"];
}

export class DraftInstructionsResponseDto implements DraftInstructions {
  @ApiProperty({
    description: "The draft instructions id",
    type: AppointmentResponseDto,
  })
  appointment: DraftInstructions["appointment"];

  @ApiProperty({
    description: "The draft instructions contacts",
    type: ContactResponseDto,
    isArray: true,
  })
  contacts: DraftInstructions["contacts"];

  @ApiProperty({
    description: "The draft instructions global",
    type: String,
  })
  global: DraftInstructions["global"];

  @ApiProperty({
    description: "The draft instructions in charge",
    type: InChargeDto,
  })
  inCharge: DraftInstructions["inCharge"];
}
