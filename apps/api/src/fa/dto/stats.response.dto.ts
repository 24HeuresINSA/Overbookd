import { ApiProperty } from "@nestjs/swagger";
import { StatsPayload, StatusCount } from "../../common/services/stats.service";
import { ftStatuses } from "../../ft/ft.model";
import { FaStatus } from "../fa.model";
import { FtStatus } from "@prisma/client";

class StatusCountRepresentation implements StatusCount {
  @ApiProperty({ enum: ftStatuses })
  status: FaStatus | FtStatus;
  @ApiProperty({})
  count: number;
}

export class StatsResponseDto implements StatsPayload {
  @ApiProperty({})
  teamCode: string;
  @ApiProperty({ isArray: true, type: StatusCountRepresentation })
  status: StatusCount[];
  @ApiProperty({})
  total: number;
}
