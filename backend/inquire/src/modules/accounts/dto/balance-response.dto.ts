import { Currency } from '../../../common/enums/currency.enum';

export class BalanceResponseDto {
  accountId: string;
  currency: Currency;
  balance: number;
}

