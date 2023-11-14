import { ApiProperty } from "@nestjs/swagger";
import { NewBarrel } from "@overbookd/personal-account";
import { IsPositive, MinLength } from "class-validator";

export class CreateBarrelRequestDto implements NewBarrel {
  @ApiProperty({
    example: "Blonde",
  })
  @MinLength(3)
  drink: string;

  @ApiProperty({
    description: "price in cents",
    example: 7000,
  })
  @IsPositive()
  price: number;
}
