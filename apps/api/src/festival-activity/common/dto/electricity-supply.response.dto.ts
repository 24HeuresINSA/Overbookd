import { ApiProperty } from "@nestjs/swagger";
import {
  ElectricityConnection,
  ElectricitySupply,
  P17_125A_TETRA,
  P17_16A_MONO,
  P17_16A_TETRA,
  P17_16A_TRI,
  P17_32A_MONO,
  P17_32A_TETRA,
  P17_32A_TRI,
  P17_63A_MONO,
  P17_63A_TETRA,
  P17_63A_TRI,
  PC16_Prise_classique,
} from "@overbookd/festival-activity";

const electricitySupplyConnections = [
  PC16_Prise_classique,
  P17_16A_MONO,
  P17_16A_TRI,
  P17_16A_TETRA,
  P17_32A_MONO,
  P17_32A_TRI,
  P17_32A_TETRA,
  P17_63A_MONO,
  P17_63A_TRI,
  P17_63A_TETRA,
  P17_125A_TETRA,
];

export class ElectricitySupplyResponseDto implements ElectricitySupply {
  @ApiProperty({})
  id: string;

  @ApiProperty({
    enum: electricitySupplyConnections,
    example: PC16_Prise_classique,
  })
  connection: ElectricityConnection;

  @ApiProperty({})
  device: string;

  @ApiProperty({})
  power: number;

  @ApiProperty({})
  count: number;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  comment: string | null;
}
