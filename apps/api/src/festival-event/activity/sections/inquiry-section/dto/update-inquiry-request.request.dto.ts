import { ApiProperty } from "@nestjs/swagger";
import { IsPositive } from "class-validator";
import { UpdateInquiryRequestForm } from "@overbookd/http";

export class UpdateInquiryRequestDto implements UpdateInquiryRequestForm {
  @ApiProperty({ required: true })
  @IsPositive()
  quantity: number;
}
