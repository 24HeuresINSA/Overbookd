import { ApiProperty } from "@nestjs/swagger";
import {
  ForceGlobalInstructions,
  ForceInChargeInstructions,
} from "@overbookd/festival-event";
import { IsDefined, IsString } from "class-validator";

export class ForceGlobalInstructionsRequestDto
  implements ForceGlobalInstructions
{
  @ApiProperty({ type: String, required: true })
  @IsDefined()
  @IsString()
  global: string;
}

export class ForceInChargeInstructionsRequestDto
  implements ForceInChargeInstructions
{
  @ApiProperty({ type: String, required: true })
  @IsDefined()
  @IsString()
  inCharge: string;
}

export class ForceInstructionsRequestDto extends ForceGlobalInstructionsRequestDto {
  @ApiProperty({ type: String, required: true })
  @IsDefined()
  @IsString()
  inCharge: string;
}
