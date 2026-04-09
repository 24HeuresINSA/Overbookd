import { ApiProperty } from "@nestjs/swagger";
import { DisplayableAssignment } from "@overbookd/http";
import { AssignmentIdentifierResponseDto } from "./assignment-identifier.response.dto";

export class DisplayableAssignmentResponseDto
  extends AssignmentIdentifierResponseDto
  implements DisplayableAssignment
{
  @ApiProperty({ type: Date })
  start: Date;

  @ApiProperty({ type: Date })
  end: Date;

  @ApiProperty({ type: String })
  name: string;
}
