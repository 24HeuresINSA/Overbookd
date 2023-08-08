import { ApiProperty } from '@nestjs/swagger';

const BACHE = 'BACHE';
const PANNEAU = 'PANNEAU';
const AFFICHE = 'AFFICHE';

export const signaTypes: Record<SignaType, SignaType> = {
  BACHE,
  PANNEAU,
  AFFICHE,
};

export type SignaType = typeof BACHE | typeof PANNEAU | typeof AFFICHE;

export interface FaSignaNeed {
  id: number;
  signaType: SignaType;
  text: string;
  count: number;
  size?: string;
  comment?: string;
}

export interface FaSignaNeedWithOptionalId {
  id?: number;
  signaType: SignaType;
  text: string;
  count: number;
  size?: string;
  comment?: string;
}

export class FaSignaNeedRepresentation implements FaSignaNeed {
  @ApiProperty({})
  id: number;
  @ApiProperty({ enum: signaTypes })
  signaType: SignaType;
  @ApiProperty({})
  text: string;
  @ApiProperty({})
  count: number;
  @ApiProperty({ required: false })
  size?: string;
  @ApiProperty({ required: false })
  comment?: string;
}

export class FaSignaNeedWithOptionalIdRepresentation
  implements FaSignaNeedWithOptionalId
{
  @ApiProperty({ required: false })
  id?: number;
  @ApiProperty({ enum: signaTypes })
  signaType: SignaType;
  @ApiProperty({})
  text: string;
  @ApiProperty({})
  count: number;
  @ApiProperty({ required: false })
  size?: string;
  @ApiProperty({ required: false })
  comment?: string;
}
