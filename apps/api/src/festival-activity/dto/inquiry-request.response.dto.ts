import { ApiProperty } from "@nestjs/swagger";
import {
  BaseInquiryRequest,
  Drive,
  InquiryRequest,
  MAGASIN,
  drives,
} from "@overbookd/festival-activity";

export class UnassignedInquiryRequestResponseDto implements BaseInquiryRequest {
  @ApiProperty({})
  slug: string;

  @ApiProperty({})
  quantity: number;

  @ApiProperty({})
  name: string;
}

type InquiryRequestAssigned = Extract<InquiryRequest, { drive: Drive }>;

export class AssignedInquiryRequestResponseDto
  extends UnassignedInquiryRequestResponseDto
  implements InquiryRequestAssigned
{
  @ApiProperty({ required: true, enum: drives, example: MAGASIN, type: String })
  drive: Drive;
}
