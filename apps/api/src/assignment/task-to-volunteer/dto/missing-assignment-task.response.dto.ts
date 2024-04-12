import { ApiProperty } from "@nestjs/swagger";
import { MissingAssignmentTask } from "@overbookd/assignment";
import { Category } from "@overbookd/festival-event-constants";

export class MissingAssignmentTaskResponseDto implements MissingAssignmentTask {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Boolean })
  topPriority: boolean;

  @ApiProperty({ type: String, required: false })
  category?: Category;

  @ApiProperty({ type: String, isArray: true })
  teams: string[];
}
