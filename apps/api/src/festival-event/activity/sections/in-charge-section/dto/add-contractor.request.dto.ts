import { ApiProperty } from "@nestjs/swagger";
import { PrepareContractorCreation } from "@overbookd/festival-event";
import { IsOptional, IsString } from "class-validator";

export class AddContractorRequestDto implements PrepareContractorCreation {
  @ApiProperty({ required: true })
  @IsString()
  firstName: string;

  @ApiProperty({ required: true })
  @IsString()
  lastName: string;

  @ApiProperty({ required: true })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}
