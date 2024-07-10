import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";

export class AdjustBarrelOpeningDateRequestDto {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  openedOn: Date;
}
