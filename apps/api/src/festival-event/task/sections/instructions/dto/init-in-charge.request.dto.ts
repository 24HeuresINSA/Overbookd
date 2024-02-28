import { ApiProperty } from "@nestjs/swagger";
import { InitInChargeForm } from "@overbookd/http";
import { IsArray, IsNotEmpty } from "class-validator";

export class InitInChargeRequestDto implements InitInChargeForm {
  @ApiProperty({})
  @IsArray()
  @IsNotEmpty()
  volunteers: number[];

  @ApiProperty({})
  @IsNotEmpty()
  instruction: string;
}
