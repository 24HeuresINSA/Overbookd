import { ApiProperty } from "@nestjs/swagger";
import { HasApplication } from "@overbookd/http";

export class HasApplicationResponseDto implements HasApplication {
  @ApiProperty({
    required: true,
    type: Boolean,
  })
  hasApplication: boolean;
}
