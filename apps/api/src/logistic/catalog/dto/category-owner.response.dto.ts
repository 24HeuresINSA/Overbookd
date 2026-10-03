import { ApiProperty } from "@nestjs/swagger";
import { CategoryOwner } from "@overbookd/logistic";

export class CategoryOwnerResponseDto implements CategoryOwner {
  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;
}
