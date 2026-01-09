import { ApiProperty } from "@nestjs/swagger";
import {
  AssignmentIdentifier,
  TeamMember,
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

class TeamMemberRequestDto implements TeamMember {
  @ApiProperty({ type: Number })
  @IsNumber()
  id: number;

  @ApiProperty({ type: String })
  @IsString()
  as: string;
}

export class VolunteersForAssignmentRequestDto implements VolunteersForAssignment {
  @ApiProperty({ type: AssignmentIdentifierRequestDto })
  @Type(() => AssignmentIdentifierRequestDto)
  @ValidateNested()
  assignment: AssignmentIdentifier;

  @ApiProperty({ type: TeamMemberRequestDto, isArray: true })
  @Type(() => TeamMemberRequestDto)
  @ValidateNested({ each: true })
  volunteers: TeamMember[];
}
