import { ApiProperty } from "@nestjs/swagger";
import { IsPositive, IsString } from "class-validator";
import { AddInquiryRequest } from "@overbookd/http";

export class AddInquiryRequestDto implements AddInquiryRequest {
  @ApiProperty({ required: true })
  @IsPositive()
  quantity: number;

  @ApiProperty({ required: true })
  @IsString()
  slug: string;
}
