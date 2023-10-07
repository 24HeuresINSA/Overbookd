import { ApiProperty } from "@nestjs/swagger";
import { StatsPayload } from "../../common/services/stats.service";
import { FaStatus } from "../fa.model";
import { FtStatus } from "@prisma/client";

export class StatsResponseDto implements StatsPayload {
  @ApiProperty({})
  teamCode: string;
  @ApiProperty({
    example: {
      DRAFT: 2,
      REFUSED: 2,
      SUBMITTED: 1,
      VALIDATED: 2,
    },
  })
  status: Record<FaStatus | FtStatus, number>;
  @ApiProperty({})
  total: number;
}
