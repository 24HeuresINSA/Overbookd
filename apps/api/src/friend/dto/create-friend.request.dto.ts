import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateFriendRequestDto {
  @ApiProperty({
    required: true,
    description: "The id of the Friend",
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
export class CreateBiDirectionalFriendRequestDto {
  @ApiProperty({
    required: true,
    description: "The id of the User",
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    required: true,
    description: "The id of the Friend",
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  friendId: number;
}
