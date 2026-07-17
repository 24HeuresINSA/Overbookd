import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsDefined, IsString } from "class-validator";

export class MailTestRequestDto {
  @ApiProperty({
    required: true,
    description: "The email of the receiver",
    example: "john@doe.com",
  })
  @IsDefined()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: "The name of the receiver",
  })
  @IsDefined()
  @IsString()
  username: string;
}
