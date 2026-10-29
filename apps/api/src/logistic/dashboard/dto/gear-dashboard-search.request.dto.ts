import { ApiProperty } from "@nestjs/swagger";
import { GearDashboardSearchOptions } from "@overbookd/http";
import { Type } from "class-transformer";
import { IsDate } from "class-validator";
import { GearSearchRequestDto } from "../../common/dto/gear-search.request.dto";

export class GearDashboardSearchRequestDto
  extends GearSearchRequestDto
  implements GearDashboardSearchOptions
{
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  start: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  end: Date;
}
