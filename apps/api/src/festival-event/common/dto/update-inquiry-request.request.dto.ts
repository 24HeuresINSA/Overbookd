import { ApiProperty } from "@nestjs/swagger";
import { UpdateInquiryRequestForm } from "@overbookd/http";
import { IsPositive } from "class-validator";

export class UpdateInquiryRequestDto implements UpdateInquiryRequestForm {
  @ApiProperty({ required: true })
  @IsPositive()
  quantity: number;
}
