import { ApiProperty } from '@nestjs/swagger';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

export class TransactionCreationDto {
  @ApiProperty({
    required: true,
    description: 'The type of the transaction',
  })
  type: TransactionType;

  @ApiProperty({
    required: true,
    description: 'The ID of the user who initiate the transaction',
  })
  from: number;

  @ApiProperty({
    required: false,
    description:
      'The ID of the user who receive the transaction, -1 if the transaction is an expense',
    default: -1,
  })
  to: number;

  @ApiProperty({
    required: true,
    description: 'The amount of the transaction',
    default: 0,
  })
  amount: number;

  @ApiProperty({
    required: false,
    description: 'The description of the transaction',
  })
  context: number;

  @ApiProperty({
    required: false,
    description: 'The date of the transaction',
    default: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    required: false,
    description: 'The validation status of the transaction',
    default: true,
  })
  isValid: boolean;
}
