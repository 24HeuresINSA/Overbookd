import { ApiProperty } from "@nestjs/swagger";
import { ConfiguredBarrel } from "@overbookd/personal-account";

export class BarrelResponseDto implements ConfiguredBarrel {
  @ApiProperty({})
  slug: string;

  @ApiProperty({})
  drink: string;

  @ApiProperty({})
  price: number;
}
