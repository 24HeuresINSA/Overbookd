import { ApiProperty } from '@nestjs/swagger';

const PC16_Prise_classique = 'PC16_Prise_classique';
const P17_16A_MONO = 'P17_16A_MONO';
const P17_16A_TRI = 'P17_16A_TRI';
const P17_16A_TETRA = 'P17_16A_TETRA';
const P17_32A_MONO = 'P17_32A_MONO';
const P17_32A_TRI = 'P17_32A_TRI';
const P17_32A_TETRA = 'P17_32A_TETRA';
const P17_63A_MONO = 'P17_63A_MONO';
const P17_63A_TRI = 'P17_63A_TRI';
const P17_63A_TETRA = 'P17_63A_TETRA';
const P17_125A_TETRA = 'P17_125A_TETRA';

export type ElectricityType =
  | typeof PC16_Prise_classique
  | typeof P17_16A_MONO
  | typeof P17_16A_TRI
  | typeof P17_16A_TETRA
  | typeof P17_32A_MONO
  | typeof P17_32A_TRI
  | typeof P17_32A_TETRA
  | typeof P17_63A_MONO
  | typeof P17_63A_TRI
  | typeof P17_63A_TETRA
  | typeof P17_125A_TETRA;

export const electricityTypes: Record<ElectricityType, ElectricityType> = {
  PC16_Prise_classique: PC16_Prise_classique,
  P17_16A_MONO: P17_16A_MONO,
  P17_16A_TRI: P17_16A_TRI,
  P17_16A_TETRA: P17_16A_TETRA,
  P17_32A_MONO: P17_32A_MONO,
  P17_32A_TRI: P17_32A_TRI,
  P17_32A_TETRA: P17_32A_TETRA,
  P17_63A_MONO: P17_63A_MONO,
  P17_63A_TRI: P17_63A_TRI,
  P17_63A_TETRA: P17_63A_TETRA,
  P17_125A_TETRA: P17_125A_TETRA,
};

export interface FaElectricityNeed {
  id: number;
  electricityType: ElectricityType;
  power: number;
  device?: string;
  count?: number;
  comment?: string;
}

export interface FaElectricityNeedWithOptionalId {
  id?: number;
  electricityType: ElectricityType;
  power: number;
  device?: string;
  count?: number;
  comment?: string;
}

export class FaElectricityNeedRepresentation implements FaElectricityNeed {
  @ApiProperty({})
  id: number;
  @ApiProperty({ enum: electricityTypes })
  electricityType: ElectricityType;
  @ApiProperty({})
  device: string;
  @ApiProperty({})
  power: number;
  @ApiProperty({})
  count: number;
  @ApiProperty({ required: false })
  comment?: string;
}

export class FaElectricityNeedWithOptionalIdRepresentation
  implements FaElectricityNeedWithOptionalId
{
  @ApiProperty({ required: false })
  id?: number;
  @ApiProperty({ enum: electricityTypes })
  electricityType: ElectricityType;
  @ApiProperty({})
  device: string;
  @ApiProperty({})
  power: number;
  @ApiProperty({})
  count: number;
  @ApiProperty({ required: false })
  comment?: string;
}
