import { ApiProperty, getSchemaPath } from "@nestjs/swagger";
import {
  WithInChargeInstructions,
  WithoutInChargeInstructions,
  FestivalTaskInReview as InReview,
} from "@overbookd/festival-event";
import { ContactResponseDto } from "../contact.response.dto";
import {} from "@overbookd/http";
import { AdherentResponseDto } from "../../../../common/dto/adherent.response.dto";
import { LocationResponseDto } from "../../../../common/dto/location.response.dto";

type Instructions = InReview["instructions"];

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
    type: LocationResponseDto,
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
    oneOf: [
      { $ref: getSchemaPath(WithInChargeInstructionsDto) },
      { $ref: getSchemaPath(WithoutInChargeInstructionsDto) },
    ],
  })
  inCharge: Instructions["inCharge"];
}
