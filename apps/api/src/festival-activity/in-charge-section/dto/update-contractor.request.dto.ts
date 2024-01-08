import { ApiProperty } from "@nestjs/swagger";
import { PrepareContractorUpdate } from "@overbookd/festival-activity";
import { IsOptional, IsString } from "class-validator";


export type UpdateContractorRequest = Omit<PrepareContractorUpdate, "id">;

export class UpdateContractorRequestDto implements UpdateContractorRequest {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstname?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastname?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

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
