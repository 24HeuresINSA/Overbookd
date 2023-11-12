import { ApiProperty } from "@nestjs/swagger";
import { IsPositive } from "class-validator";

export class AdjustBarrelPriceRequestDto {
  @ApiProperty({})
  @IsPositive()
  price: number;
}
