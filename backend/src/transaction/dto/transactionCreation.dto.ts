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
    required: true,
    description: 'The ID of the user who receive the transaction',
  })
  to: number;

  @ApiProperty({
    required: true,
    description: 'The amount of the transaction',
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
  })
  createdAt: Date;

  @ApiProperty({
    required: false,
    description: 'The validation status of the transaction',
  })
  isValide: boolean;
}
