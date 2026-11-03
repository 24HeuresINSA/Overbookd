import { ApiProperty } from "@nestjs/swagger";
import {
  Adherent,
  Contractor,
  FestivalActivityDraft,
} from "@overbookd/festival-event";
import { AdherentResponseDto } from "../../../../common/dto/adherent.response.dto";
import { ContractorResponseDto } from "../contractor.response.dto";

export type InCharge = FestivalActivityDraft["inCharge"];
export class InChargeDto implements InCharge {
  @ApiProperty({
    description: "Adherent in charge of this festival activity",
    type: AdherentResponseDto,
  })
  adherent: Adherent;

  @ApiProperty({
    description: "Team in charge of this festival activity",
    required: true,
    nullable: true,
  })
  team: string | null;

  @ApiProperty({
    description: "Contractors in charge of this festival activity",
    type: ContractorResponseDto,
    isArray: true,
  })
  contractors: Contractor[];
}
