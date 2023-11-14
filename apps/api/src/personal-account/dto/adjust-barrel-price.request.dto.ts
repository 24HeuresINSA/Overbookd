import { ApiProperty } from "@nestjs/swagger";
import { IsPositive } from "class-validator";

export class AdjustBarrelPriceRequestDto {
  @ApiProperty({
    description: "price in cents",
    example: 7000,
  })
  @IsPositive()
  price: number;
}
