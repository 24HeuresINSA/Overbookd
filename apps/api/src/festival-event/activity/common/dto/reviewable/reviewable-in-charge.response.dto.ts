import { ApiProperty } from "@nestjs/swagger";
import { Adherent, Contractor, Reviewable } from "@overbookd/festival-event";
import { AdherentResponseDto } from "../../../../common/dto/adherent.response.dto";
import { ContractorResponseDto } from "../contractor.response.dto";

type InCharge = Reviewable["inCharge"];
export class InChargeResponseDto implements InCharge {
  @ApiProperty({ required: true, type: AdherentResponseDto })
  adherent: Adherent;

  @ApiProperty({ required: true })
  team: string;

  @ApiProperty({ required: true, isArray: true, type: ContractorResponseDto })
  contractors: Contractor[];
}
