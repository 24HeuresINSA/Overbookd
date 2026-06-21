import { ApiProperty } from "@nestjs/swagger";
import { UserPersonalData } from "@overbookd/user";

export class UserPersonalDataResponseDto implements UserPersonalData {
  @ApiProperty({
    name: "id",
    description: "User id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    name: "firstName",
    description: "User first name",
    type: String,
  })
  firstName: string;

  @ApiProperty({
    name: "lastName",
    description: "User last name",
    type: String,
  })
  lastName: string;

  @ApiProperty({
    name: "nickname",
    description: "User nickname",
    type: String,
    required: false,
  })
  nickname: string | null;

  @ApiProperty({
    name: "email",
    description: "User email",
    type: String,
    example: "john@doe.com",
  })
  email: string;

  @ApiProperty({
    name: "birthDate",
    description: "User date of birth",
    type: Date,
  })
  birthDate: Date;

  @ApiProperty({
    name: "phoneNumber",
    description: "User phone number",
    type: String,
    example: "0601020304",
  })
  phoneNumber: string;

  @ApiProperty({
    name: "comment",
    description: "User comment",
    type: String,
    required: false,
  })
  comment: string | null;

  @ApiProperty({
    name: "profilePicture",
    description: "User profile picture link",
    type: String,
    required: false,
  })
  profilePicture: string | null;

  @ApiProperty({
    name: "charisma",
    description: "User charisma",
    type: Number,
  })
  charisma: number;

  @ApiProperty({
    name: "teams",
    description: "User teams",
    type: String,
    isArray: true,
  })
  teams: string[];
}
