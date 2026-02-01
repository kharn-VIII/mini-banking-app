import { BadRequestException } from '@nestjs/common';

export class InsufficientFundsException extends BadRequestException {
  constructor(accountId: string, balance: number, requestedAmount: number) {
    super(
      `Insufficient funds. Account ${accountId} has balance ${balance}, but ${requestedAmount} was requested`,
    );
  }
}

