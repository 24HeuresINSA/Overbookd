import { ApiProperty } from "@nestjs/swagger";
import { AssignmentIdentifier } from "@overbookd/assignment";

export class AssignmentIdentifierResponseDto implements AssignmentIdentifier {
  @ApiProperty({ type: String })
  assignmentId: string;

  @ApiProperty({ type: String })
  mobilizationId: string;

  @ApiProperty({ type: Number })
  taskId: number;
}
