import { ApiProperty } from "@nestjs/swagger";
import { drives, Drive } from "@overbookd/festival-event-constants";
import { IsEnum } from "class-validator";

export class LinkInquiryDriveRequestDto {
  @ApiProperty({ required: true, enum: drives })
  @IsEnum(drives, { message: () => "Le lieu de stockage est invalide" })
  drive: Drive;
}
