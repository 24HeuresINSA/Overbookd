import { ApiProperty } from "@nestjs/swagger";
import { IsPositive, IsString } from "class-validator";
import { AddInquiryRequestForm } from "@overbookd/http";

export class AddInquiryRequestDto implements AddInquiryRequestForm {
  @ApiProperty({ required: true })
  @IsPositive()
  quantity: number;

  @ApiProperty({ required: true })
  @IsString()
  slug: string;
}
