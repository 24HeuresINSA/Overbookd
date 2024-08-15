import { ApiProperty } from "@nestjs/swagger";
import { AvailabilityForm } from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/time";
import { IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { PeriodRequestDto } from "../../common/dto/period.request.dto";

export class AvailabilitiesRequestDto implements AvailabilityForm {
  @ApiProperty({ type: PeriodRequestDto, isArray: true })
  @IsArray()
  @Type(() => PeriodRequestDto)
  @ValidateNested({ each: true })
  availabilities: IProvidePeriod[];
}
