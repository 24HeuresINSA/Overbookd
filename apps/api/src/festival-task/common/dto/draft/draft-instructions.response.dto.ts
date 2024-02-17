import { ApiProperty } from "@nestjs/swagger";
import { FestivalTaskDraft } from "@overbookd/festival-event";
import { AppointmentResponseDto } from "../appointment.response.dto";
import { ContactResponseDto } from "../contact.response.dto";
import { AdherentResponseDto } from "../adherent.response.dto";

type DraftInstructions = FestivalTaskDraft["instructions"];
type InCharge = DraftInstructions["inCharge"];

class InChargeDto implements InCharge {
  @ApiProperty({
    description: "List of volunteers in charge of the task",
    type: AdherentResponseDto,
    isArray: true,
  })
  volunteers: InCharge["volunteers"];

  @ApiProperty({
    description: "Dedicated instruction for volunteers in charge of the task",
    type: String,
  })
  instruction: InCharge["instruction"];
}

export class DraftInstructionsResponseDto implements DraftInstructions {
  @ApiProperty({
    description: "Appointment location",
    type: AppointmentResponseDto,
  })
  appointment: DraftInstructions["appointment"];

  @ApiProperty({
    description: "Volunteers to contact in case of issue",
    type: ContactResponseDto,
    isArray: true,
  })
  contacts: DraftInstructions["contacts"];

  @ApiProperty({
    description: "Instruction to handle the task",
    type: String,
  })
  global: DraftInstructions["global"];

  @ApiProperty({
    description: "The draft instructions in charge",
    type: InChargeDto,
  })
  inCharge: DraftInstructions["inCharge"];
}
