import { ApiProperty } from "@nestjs/swagger";
import {
  ElectricityConnection,
  ElectricitySupply,
} from "@overbookd/festival-event";
import {
  supplyConnections,
  PC16_Prise_classique,
} from "@overbookd/festival-event-constants";

export class ElectricitySupplyResponseDto implements ElectricitySupply {
  @ApiProperty()
  id: string;

  @ApiProperty({
    enum: supplyConnections,
    example: PC16_Prise_classique,
  })
  connection: ElectricityConnection;

  @ApiProperty()
  device: string;

  @ApiProperty()
  power: number;

  @ApiProperty()
  count: number;

  @ApiProperty({
    required: true,
    nullable: true,
  })
  comment: string | null;
}
