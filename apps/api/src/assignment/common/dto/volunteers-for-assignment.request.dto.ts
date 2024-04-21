import { ApiProperty } from "@nestjs/swagger";
import {
  Assignee,
  AssignmentIdentifier,
  VolunteersForAssignment,
} from "@overbookd/assignment";
import { Type } from "class-transformer";
import { IsNumber, IsString, ValidateNested } from "class-validator";

class AssignmentIdentifierRequestDto implements AssignmentIdentifier {
  @ApiProperty({ type: String })
  @IsString()
  assignmentId: string;

  @ApiProperty({ type: String })
  @IsString()
  mobilizationId: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  taskId: number;
}

class AssigneeRequestDto implements Assignee {
  @ApiProperty({ type: Number })
  @IsNumber()
  id: number;

  @ApiProperty({ type: String })
  @IsString()
  as: string;
}

export class VolunteersForAssignmentRequestDto
  implements VolunteersForAssignment
{
  @ApiProperty({ type: AssignmentIdentifierRequestDto })
  @Type(() => AssignmentIdentifierRequestDto)
  @ValidateNested()
  assignment: AssignmentIdentifier;

  @ApiProperty({ type: AssigneeRequestDto, isArray: true })
  @Type(() => AssigneeRequestDto)
  @ValidateNested({ each: true })
  volunteers: Assignee[];
}
