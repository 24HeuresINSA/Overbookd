import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateSignaLocationRequestDto {
  @ApiProperty({
    description: "The name of the location",
    example: "Devant les humas",
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
