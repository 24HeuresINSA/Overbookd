import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { AddInquiryRequestForm, InitInquiryRequest } from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/period";
import { PeriodRequestDto } from "../../../../common/dto/period.request.dto";
import { Type } from "class-transformer";
import { AddInquiryRequestDto } from "./add-inquiry-request.request.dto";

export class InitInquiryRequestDto implements InitInquiryRequest {
  @ApiProperty({
    required: true,
    type: PeriodRequestDto,
  })
  @Type(() => PeriodRequestDto)
  @ValidateNested()
  timeWindow: IProvidePeriod;

  @ApiProperty({
    required: true,
    type: AddInquiryRequestDto,
  })
  @Type(() => AddInquiryRequestDto)
  @ValidateNested()
  request: AddInquiryRequestForm;
}
