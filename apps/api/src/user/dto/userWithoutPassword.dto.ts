import { ApiProperty } from '@nestjs/swagger';
import { UserWithoutPassword } from '../user.model';
import { Departments, Years } from './common';

export class UserWithoutPasswordDto implements UserWithoutPassword {
  @ApiProperty({
    name: 'id',
    description: 'User id',
    type: Number,
  })
  id: number;

  @ApiProperty({
    name: 'firstname',
    description: 'User firstname',
    type: String,
  })
  firstname: string;

  @ApiProperty({
    name: 'lastname',
    description: 'User lastname',
    type: String,
  })
  lastname: string;

  @ApiProperty({
    name: 'nickname',
    description: 'User nickname',
    type: String,
    required: false,
  })
  nickname: string | null;

  @ApiProperty({
    name: 'email',
    description: 'User email',
    type: String,
  })
  email: string;

  @ApiProperty({
    name: 'birthdate',
    description: 'User birthdate',
    type: Date,
  })
  birthdate: Date;

  @ApiProperty({
    name: 'phone',
    description: 'User phone number',
    type: String,
  })
  phone: string;

  @ApiProperty({
    name: 'department',
    description: 'User department',
    enum: Departments,
    required: false,
  })
  department: Departments | null;

  @ApiProperty({
    name: 'comment',
    description: 'User comment',
    type: String,
    required: false,
  })
  comment: string | null;

  @ApiProperty({
    name: 'reset_password_token',
    description: 'User reset password token',
    type: String,
    required: false,
  })
  resetPasswordToken: string | null;

  @ApiProperty({
    name: 'reset_password_expires',
    description: 'User reset password expiration date',
    type: String,
    required: false,
  })
  resetPasswordExpires: Date | null;

  @ApiProperty({
    name: 'has_payed_contributions',
    description: 'User contribution payment',
    type: Boolean,
  })
  hasPayedContributions: boolean;

  @ApiProperty({
    name: 'year',
    description: 'User year',
    enum: Years,
    required: false,
  })
  year: Years | null;

  @ApiProperty({
    name: 'profilePicture',
    description: 'User profile picture link',
    type: String,
    required: false,
  })
  profilePicture: string | null;

  @ApiProperty({
    name: 'charisma',
    description: 'User charisma',
    type: Number,
  })
  charisma: number;

  @ApiProperty({
    name: 'balance',
    description: 'User personnal account balance',
    type: Number,
  })
  balance: number;

  @ApiProperty({
    name: 'created_at',
    description: 'User creation date',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    name: 'updated_at',
    description: 'User update date',
    type: Date,
  })
  updatedAt: Date;

  @ApiProperty({
    name: 'is_deleted',
    description: 'User deletion status',
    type: Boolean,
  })
  isDeleted: boolean;
}
