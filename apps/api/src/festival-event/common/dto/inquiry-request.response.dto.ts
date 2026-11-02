import { ApiProperty } from "@nestjs/swagger";
import { BaseInquiryRequest, InquiryRequest } from "@overbookd/festival-event";
import { drives, MAGASIN, Drive } from "@overbookd/festival-event-constants";

export class UnassignedInquiryRequestResponseDto implements BaseInquiryRequest {
  @ApiProperty({
    description: "The inquiry request slug",
    type: String,
  })
  slug: string;

  @ApiProperty({
    description: "The inquiry request quantity",
    type: Number,
  })
  quantity: number;

  @ApiProperty({
    description: "The inquiry request name",
    type: String,
  })
  name: string;
}

type InquiryRequestAssigned = Extract<InquiryRequest, { drive: Drive }>;

export class AssignedInquiryRequestResponseDto
  extends UnassignedInquiryRequestResponseDto
  implements InquiryRequestAssigned
{
  @ApiProperty({
    description: "The inquiry request drive",
    required: true,
    enum: drives,
    example: MAGASIN,
    type: String,
  })
  drive: Drive;
}
