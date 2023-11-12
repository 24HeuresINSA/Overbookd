import { ApiProperty } from "@nestjs/swagger";
import { NewBarrel } from "@overbookd/personal-account";
import { IsPositive, MinLength } from "class-validator";

export class CreateBarrelRequestDto implements NewBarrel {
  @ApiProperty({})
  @MinLength(3)
  drink: string;

  @ApiProperty({})
  @IsPositive()
  price: number;
}
