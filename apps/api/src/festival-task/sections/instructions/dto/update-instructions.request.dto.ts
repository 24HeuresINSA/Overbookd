import { ApiProperty } from "@nestjs/swagger";
import { UpdateInstructionsForm } from "@overbookd/http";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class InstructionsRequestDto implements UpdateInstructionsForm {
  @ApiProperty({
    description: "Appointment id",
    required: false,
  })
  @IsNumber()
  @IsOptional()
  appointmentId?: number;

  @ApiProperty({
    description: "Global instructions",
    required: false,
  })
  @IsString()
  @IsOptional()
  global?: string;

  @ApiProperty({
    description: "In charge volunteers",
    required: false,
  })
  @IsNumber()
  @IsOptional()
  inCharge?: string;
}
