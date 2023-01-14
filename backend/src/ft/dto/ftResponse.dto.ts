import { ApiProperty } from '@nestjs/swagger';
import { FtStatus } from '@prisma/client';

export class FtResponseDto {
  @ApiProperty({
    required: true,
    description: 'The id of the ft',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The name of the ft',
    type: String,
  })
  name: string;

  @ApiProperty({
    required: true,
    description: 'The status of the ft',
    enum: FtStatus,
  })
  status: FtStatus;

  @ApiProperty({
    required: false,
    description: 'The parent fa id of the ft',
    type: Number,
  })
  parentFaId?: number;

  @ApiProperty({
    required: false,
    description: 'isStatic of the ft',
    type: Boolean,
  })
  isStatic?: boolean;

  @ApiProperty({
    required: false,
    description: 'The description of the ft',
    type: String,
  })
  description?: string;

  @ApiProperty({
    required: false,
    description: 'The user in charge id of the ft',
    type: Number,
  })
  userInChargeId?: number;

  @ApiProperty({
    required: false,
    description: 'The location id of the ft',
    type: Number,
  })
  locationId?: number;

  @ApiProperty({
    required: false,
    description: 'isDeleted of the ft',
    type: Boolean,
  })
  isDeleted?: boolean;
}
