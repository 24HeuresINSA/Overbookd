import { ApiProperty } from "@nestjs/swagger";
import { UpdateMealMenu } from "@overbookd/http";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateMenuRequestDto implements UpdateMealMenu {
  @ApiProperty({ description: "New menu of the shared meal" })
  @IsString()
  @IsNotEmpty()
  menu: string;
}
