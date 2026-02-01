import { IsEnum, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '../../../common/enums/currency.enum';

export class CreateTransferDto {
  @ApiProperty({
    description: 'UUID of the user to transfer money to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  toUserId: string;

  @ApiProperty({
    description: 'Amount to transfer',
    example: 100.50,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Currency of the transfer',
    enum: Currency,
    example: Currency.USD,
  })
  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;
}

