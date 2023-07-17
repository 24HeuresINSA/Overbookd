import { ApiProperty } from '@nestjs/swagger';
import { FaIdResponse } from '../faTypes';

export class FollowingFaResponseDto implements FaIdResponse {
  @ApiProperty({})
  id: number;
}
