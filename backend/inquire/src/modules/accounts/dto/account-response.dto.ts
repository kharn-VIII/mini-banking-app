import { Currency } from '../../../common/enums/currency.enum';

export class AccountResponseDto {
  id: string;
  currency: Currency;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

