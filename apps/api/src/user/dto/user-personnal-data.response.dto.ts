import { ApiProperty } from "@nestjs/swagger";
import { UserPersonnalData } from "@overbookd/user";
import { UserContribution } from "@overbookd/contribution";
import { ContributionResponseDto } from "../../contribution/dto/contribution.response.dto";

export class UserPersonnalDataResponseDto implements UserPersonnalData {
  @ApiProperty({
    name: "id",
    description: "User id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    name: "firstname",
    description: "User firstname",
    type: String,
  })
  firstname: string;

  @ApiProperty({
    name: "lastname",
    description: "User lastname",
    type: String,
  })
  lastname: string;

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
    name: "birthdate",
    description: "User birthdate",
    type: Date,
  })
  birthdate: Date;

  @ApiProperty({
    name: "phone",
    description: "User phone number",
    type: String,
    example: "0601020304",
  })
  phone: string;

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
    name: "balance",
    description: "User personnal account balance",
    type: Number,
  })
  balance: number;

  @ApiProperty({
    name: "teams",
    description: "User teams",
    type: String,
    isArray: true,
  })
  teams: string[];

  @ApiProperty({
    name: "contribution",
    description: "User current contribution",
    type: ContributionResponseDto,
  })
  contribution?: UserContribution;
}
