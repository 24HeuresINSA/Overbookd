import { ApiProperty } from "@nestjs/swagger";
import { PrepareContractorUpdate } from "@overbookd/festival-event";
import { IsOptional, IsString } from "class-validator";

export type UpdateContractorRequest = Omit<PrepareContractorUpdate, "id">;

export class UpdateContractorRequestDto implements UpdateContractorRequest {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

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
