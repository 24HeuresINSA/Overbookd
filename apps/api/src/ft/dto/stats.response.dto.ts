import { ApiProperty } from "@nestjs/swagger";
import { StatsPayload } from "../stats.service";
import { FtStatus } from "../ft.model";

export class StatsResponseDto implements StatsPayload {
  @ApiProperty({ description: "team in charge of tasks" })
  teamCode: string;

  @ApiProperty({
    description: "count for each task status",
    example: {
      DRAFT: 2,
      REFUSED: 2,
      SUBMITTED: 1,
      VALIDATED: 2,
    },
  })
  status: Record<FtStatus, number>;

  @ApiProperty({ description: "tasks count" })
  total: number;
}
