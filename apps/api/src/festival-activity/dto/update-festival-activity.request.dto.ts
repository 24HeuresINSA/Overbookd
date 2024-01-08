import { ApiProperty } from "@nestjs/swagger";
import {
  PrepareFeedbackPublish,
  Drive,
  drives,
} from "@overbookd/festival-activity";
import { IsEnum, IsPositive, IsString, ValidateNested } from "class-validator";
import { AddInquiryRequest, InitInquiryRequest } from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/period";
import { PeriodDto } from "../common/dto/period.dto";
import { Type } from "class-transformer";

export class AddInquiryRequestDto implements AddInquiryRequest {
  @ApiProperty({ required: true })
  @IsPositive()
  quantity: number;

  @ApiProperty({ required: true })
  @IsString()
  slug: string;
}

export class LinkInquiryDriveRequestDto {
  @ApiProperty({ required: true, enum: drives })
  @IsEnum(drives)
  drive: Drive;
}

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

export class AddFeedbackRequestDto implements PrepareFeedbackPublish {
  @ApiProperty({ required: true })
  @IsString()
  content: string;
}
