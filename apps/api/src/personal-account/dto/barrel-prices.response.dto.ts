import { ApiProperty } from "@nestjs/swagger";
import { BarrelPrices } from "@overbookd/personal-account";

export class BarrelPricesResponseDto implements BarrelPrices {
  @ApiProperty({})
  prixFutBlonde: number;

  @ApiProperty({})
  prixFutBlanche: number;

  @ApiProperty({})
  prixFutTriple: number;

  @ApiProperty({})
  prixFutFlower: number;
}
