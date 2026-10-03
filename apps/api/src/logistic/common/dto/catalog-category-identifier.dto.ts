import { ApiProperty } from "@nestjs/swagger";
import { CatalogCategoryIdentifier } from "@overbookd/logistic";

export class CatalogCategoryIdentifierResponseDto implements CatalogCategoryIdentifier {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  path: string;
}
