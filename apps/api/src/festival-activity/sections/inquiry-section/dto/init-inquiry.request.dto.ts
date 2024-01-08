import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { AddInquiryRequest, InitInquiryRequest } from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/period";
import { PeriodDto } from "../../../common/dto/period.dto";
import { Type } from "class-transformer";
import { AddInquiryRequestDto } from "./add-inquiry-request.request.dto";


export class InitInquiryRequestDto implements InitInquiryRequest {
  @ApiProperty({
    required: true,
    type: PeriodDto,
  })
  @Type(() => PeriodDto)
  @ValidateNested()
  timeWindow: IProvidePeriod;

  @ApiProperty({
    required: true,
    type: AddInquiryRequestDto,
  })
  @Type(() => AddInquiryRequestDto)
  @ValidateNested()
  request: AddInquiryRequest;
}
