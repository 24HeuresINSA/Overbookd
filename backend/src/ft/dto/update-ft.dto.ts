import { ApiProperty } from '@nestjs/swagger';
import { FtStatus } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidationArguments,
} from 'class-validator';

export class UpdateFtDto {
  @ApiProperty({
    required: true,
    description: 'The name of the ft',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    description: 'The status of the ft',
    enum: FtStatus,
    default: FtStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(FtStatus, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(FtStatus)}`,
  })
  status?: FtStatus;

  @ApiProperty({
    required: false,
    description: 'The id of the parent fa',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  parentFaId?: number;

  @ApiProperty({
    required: false,
    description: 'Is the activity static',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isStatic?: boolean;

  @ApiProperty({
    required: false,
    description: 'The description of the ft',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: false,
    description: 'The id of the user whos responsible of the ft',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  userInChargeId?: number;

  @ApiProperty({
    required: false,
    description: 'The id of the location of the ft',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  locationId?: number;

  @ApiProperty({
    required: false,
    description: 'Is the ft deleted',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
