import { ApiProperty } from "@nestjs/swagger";
import { PrepareContractorCreation } from "@overbookd/festival-activity";
import { IsOptional, IsString } from "class-validator";

export class AddContractorRequestDto implements PrepareContractorCreation {
  @ApiProperty({ required: true })
  @IsString()
  firstname: string;

  @ApiProperty({ required: true })
  @IsString()
  lastname: string;

  @ApiProperty({ required: true })
  @IsString()
  phone: string;

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
