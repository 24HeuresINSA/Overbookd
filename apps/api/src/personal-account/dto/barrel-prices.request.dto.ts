import { ApiProperty } from "@nestjs/swagger";
import { BarrelPrices } from "@overbookd/personal-account";
import { IsPositive } from "class-validator";

export class BarrelPricesRequestDto implements BarrelPrices {
  @ApiProperty({})
  @IsPositive()
  prixFutBlonde: number;

  @ApiProperty({})
  @IsPositive()
  prixFutBlanche: number;

  @ApiProperty({})
  @IsPositive()
  prixFutTriple: number;

  @ApiProperty({})
  @IsPositive()
  prixFutFlower: number;
}
