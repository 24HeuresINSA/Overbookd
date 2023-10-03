import { ApiProperty } from "@nestjs/swagger";
import { StatsPayload } from "../../common/services/stats.service";
import { FaStatus } from "../fa.model";
import { FtStatus } from "@prisma/client";

export class StatsResponseDto implements StatsPayload {
  @ApiProperty({})
  teamCode: string;
  @ApiProperty({})
  status: Record<FaStatus | FtStatus, number>;
  @ApiProperty({})
  total: number;
}
