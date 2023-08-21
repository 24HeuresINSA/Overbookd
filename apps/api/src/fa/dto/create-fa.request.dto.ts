import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateFaRequestDto {
  @ApiProperty({
    required: true,
    description: "The name of the fa",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
