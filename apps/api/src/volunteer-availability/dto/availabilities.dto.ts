import { ApiProperty } from "@nestjs/swagger";
import { AvailabilityForm } from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/period";
import { PeriodDto } from "./period.dto";
import { IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class AvailabilitiesRequestDto implements AvailabilityForm {
  @ApiProperty({ type: PeriodDto, isArray: true })
  @IsArray()
  @Type(() => PeriodDto)
  @ValidateNested({ each: true })
  availabilities: IProvidePeriod[];
}
