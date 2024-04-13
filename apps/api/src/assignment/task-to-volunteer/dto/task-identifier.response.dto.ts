import { ApiProperty } from "@nestjs/swagger";
import { TaskIdentifier } from "@overbookd/assignment";

export class TaskIdentifierResponseDto implements TaskIdentifier {
  @ApiProperty({ type: Number })
  id: TaskIdentifier["id"];

  @ApiProperty({ type: String })
  name: TaskIdentifier["name"];
}
