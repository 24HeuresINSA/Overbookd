import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive, IsString } from "class-validator";
import { AddInquiryRequestForm } from "@overbookd/http";

export class AddInquiryRequestDto implements AddInquiryRequestForm {
  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({ type: String, required: true })
  @IsString()
  slug: string;
}
