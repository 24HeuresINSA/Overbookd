import { ApiProperty } from "@nestjs/swagger";
import { CategoryOwner } from "@overbookd/http";

export class CategoryOwnerResponseDto implements CategoryOwner {
  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;
}
