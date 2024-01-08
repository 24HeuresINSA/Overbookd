import { ApiProperty } from "@nestjs/swagger";
import {
  Drive,
  drives
} from "@overbookd/festival-activity";
import { IsEnum } from "class-validator";


export class LinkInquiryDriveRequestDto {
  @ApiProperty({ required: true, enum: drives })
  @IsEnum(drives)
  drive: Drive;
}
