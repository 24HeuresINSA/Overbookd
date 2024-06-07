import { ApiProperty } from "@nestjs/swagger";
import { CatalogCategoryIdentifier } from "@overbookd/http";

export class CatalogCategoryIdentifierResponseDto
  implements CatalogCategoryIdentifier
{
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  path: string;
}
