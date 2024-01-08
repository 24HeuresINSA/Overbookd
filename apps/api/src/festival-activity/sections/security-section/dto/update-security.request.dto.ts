import { ApiProperty } from "@nestjs/swagger";
import { PrepareSecurityUpdate } from "@overbookd/festival-activity";
import {
  IsNumber,
  IsOptional, IsString
} from "class-validator";


export class SecurityRequestDto implements PrepareSecurityUpdate {
  @ApiProperty({
    description: "Festival activity special security need",
    required: false,
  })
  @IsString()
  @IsOptional()
  specialNeed?: string | null;

  @ApiProperty({
    description: "Festival activity free pass number",
    required: false,
  })
  @IsNumber()
  @IsOptional()
  freePass?: number;
}
