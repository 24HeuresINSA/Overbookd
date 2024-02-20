import { ApiProperty } from "@nestjs/swagger";
import {
  WithInChargeInstructions,
  WithoutInChargeInstructions,
} from "@overbookd/festival-event";
import { AppointmentResponseDto } from "../appointment.response.dto";
import { ContactResponseDto } from "../contact.response.dto";
import { AdherentResponseDto } from "../adherent.response.dto";
import { InReviewWithConflicts } from "@overbookd/http";

type Instructions = InReviewWithConflicts["instructions"];

class WithInChargeInstructionsDto implements WithInChargeInstructions {
  @ApiProperty({
    description: "List of volunteers in charge of the task",
    type: AdherentResponseDto,
    isArray: true,
  })
  volunteers: WithInChargeInstructions["volunteers"];

  @ApiProperty({
    description: "Dedicated instruction for volunteers in charge of the task",
    type: String,
  })
  instruction: WithInChargeInstructions["instruction"];
}

class WithoutInChargeInstructionsDto implements WithoutInChargeInstructions {
  @ApiProperty({
    description: "List of volunteers in charge of the task",
    type: AdherentResponseDto,
    isArray: true,
  })
  volunteers: WithoutInChargeInstructions["volunteers"];

  @ApiProperty({
    description: "Dedicated instruction for volunteers in charge of the task",
    type: null,
  })
  instruction: WithoutInChargeInstructions["instruction"];
}

export class InReviewInstructionsResponseDto implements Instructions {
  @ApiProperty({
    description: "Appointment location",
    type: AppointmentResponseDto,
  })
  appointment: Instructions["appointment"];

  @ApiProperty({
    description: "Volunteers to contact in case of issue",
    type: ContactResponseDto,
    isArray: true,
  })
  contacts: Instructions["contacts"];

  @ApiProperty({
    description: "Instruction to handle the task",
    type: String,
  })
  global: Instructions["global"];

  @ApiProperty({
    description: "The draft instructions in charge",
    type: {
      oneOf: [WithInChargeInstructionsDto, WithoutInChargeInstructionsDto],
    },
  })
  inCharge: Instructions["inCharge"];
}
