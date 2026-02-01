import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '../../../common/enums/currency.enum';

export class CreateExchangeDto {
  @ApiProperty({
    description: 'Source currency to exchange from',
    enum: Currency,
    example: Currency.USD,
  })
  @IsEnum(Currency)
  @IsNotEmpty()
  fromCurrency: Currency;

  @ApiProperty({
    description: 'Target currency to exchange to',
    enum: Currency,
    example: Currency.EUR,
  })
  @IsEnum(Currency)
  @IsNotEmpty()
  toCurrency: Currency;

  @ApiProperty({
    description: 'Amount to exchange',
    example: 100.50,
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @IsNotEmpty()
  amount: number;
}

