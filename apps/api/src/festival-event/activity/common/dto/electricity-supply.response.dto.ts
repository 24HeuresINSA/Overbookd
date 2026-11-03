import { ApiProperty } from "@nestjs/swagger";
import type { ElectricitySupply } from "@overbookd/festival-event";
import {
  electricityConnections,
  ElectricityConnection,
  PC16_Prise_classique,
} from "@overbookd/festival-event-constants";

export class ElectricitySupplyResponseDto implements ElectricitySupply {
  @ApiProperty()
  id: string;

  @ApiProperty({
    enum: electricityConnections,
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
