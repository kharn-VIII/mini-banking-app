import { ApiProperty } from '@nestjs/swagger';
import { TransactionType, TransactionStatus } from '../../../common/enums/transactions.enum';
import { Currency } from '../../../common/enums/currency.enum';

export class TransactionResponseDto {
  @ApiProperty({
    description: 'Transaction unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Type of transaction',
    enum: TransactionType,
    example: TransactionType.TRANSFER,
  })
  type: TransactionType;

  @ApiProperty({
    description: 'Status of transaction',
    enum: TransactionStatus,
    example: TransactionStatus.COMPLETED,
  })
  status: TransactionStatus;

  @ApiProperty({
    description: 'Transaction amount',
    example: 100.50,
  })
  amount: number;

  @ApiProperty({
    description: 'Currency of the transaction',
    enum: Currency,
    example: Currency.USD,
  })
  currency: Currency;

  @ApiProperty({
    description: 'Source account ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  fromAccountId: string | null;

  @ApiProperty({
    description: 'Destination account ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
    nullable: true,
  })
  toAccountId: string | null;

  @ApiProperty({
    description: 'Destination user ID (for transfers)',
    example: '123e4567-e89b-12d3-a456-426614174002',
    nullable: true,
  })
  toUserId: string | null;

  @ApiProperty({
    description: 'Exchange rate used (for exchanges)',
    example: 0.85,
    nullable: true,
  })
  exchangeRate: number | null;

  @ApiProperty({
    description: 'Converted amount (for exchanges)',
    example: 85.00,
    nullable: true,
  })
  convertedAmount: number | null;

  @ApiProperty({
    description: 'Transaction creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Transaction last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

