import { ApiProperty } from "@nestjs/swagger";
import { AddInquiryRequestForm } from "@overbookd/http";
import { IsPositive, IsString } from "class-validator";

export class AddInquiryRequestDto implements AddInquiryRequestForm {
  @ApiProperty({ required: true })
  @IsPositive()
  quantity: number;

  @ApiProperty({ required: true })
  @IsString()
  slug: string;
}
