import { ApiProperty } from "@nestjs/swagger";
import { ConfiguredBarrel } from "@overbookd/personal-account";

export class BarrelResponseDto implements ConfiguredBarrel {
  @ApiProperty({
    example: "blonde",
  })
  slug: string;

  @ApiProperty({
    example: "Blonde",
  })
  drink: string;

  @ApiProperty({
    description: "price in cents",
    example: 7000,
  })
  price: number;
}
