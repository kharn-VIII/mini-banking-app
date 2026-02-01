import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { TransactionType, TransactionStatus } from '../../common/enums/transactions.enum';
import { Currency } from '../../common/enums/currency.enum';
import { normalizeAmount, roundToTwoDecimals } from '../../common/utils/currency.utils';
import { UserService } from '../users/user.service';
import { AccountsService } from '../accounts/accounts.service';
import { LedgerService } from '../ledger/ledger.service';
import { ConfigService } from '@nestjs/config';
import { getExchangeRateConfig } from '../../config/exchange-rate.config';


export interface TransferParams {
    fromUserId: string;
    toUserId: string;
    amount: number;
    currency: Currency;
}
  
export interface ExchangeParams {
    userId: string;
    fromCurrency: Currency;
    toCurrency: Currency;
    amount: number;
}
  
export interface FindAllParams {
    userId: string;
    type?: TransactionType;
    page?: number;
    limit?: number;
}
  
export interface PaginatedResult<T> {
    transactions: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly userService: UserService,
    private readonly accountsService: AccountsService,
    private readonly ledgerService: LedgerService,
    private readonly configService: ConfigService,
  ) {}

  async transfer(params: TransferParams): Promise<Transaction> {
    const { fromUserId, toUserId, amount, currency } = params;

    if (fromUserId === toUserId) {
      throw new BadRequestException(
        'Cannot transfer to the same user',
      );
    }

    const normalizedAmount = normalizeAmount(amount);

    //INTEGRATION POINT - Validate users exist
    await this.userService.findById(fromUserId);
    await this.userService.findById(toUserId);

    //INTEGRATION POINT - Find accounts
    const fromAccount = await this.accountsService.findByUserIdAndCurrency(fromUserId, currency);
    const toAccount = await this.accountsService.findByUserIdAndCurrency(toUserId, currency);
    if (!fromAccount || !toAccount) {
      throw new NotFoundException('Account not found');
    }

    //INTEGRATION POINT - Validate sufficient funds
    await this.accountsService.validateSufficientFunds(fromAccount.id, normalizedAmount);

    const transaction = this.transactionRepository.create({
      userId: fromUserId,
      type: TransactionType.TRANSFER,
      status: TransactionStatus.COMPLETED,
      amount: normalizedAmount,
      currency,
      fromAccountId: fromAccount.id,
      toAccountId: toAccount.id,
      toUserId,
      exchangeRate: null,
      convertedAmount: null,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    //INTEGRATION POINT - Create ledger entries
    await this.ledgerService.createTransferEntry(
      fromAccount.id,
      toAccount.id,
      normalizedAmount,
      savedTransaction.id,
      currency,
    );

    return savedTransaction;
  }

  async exchange(params: ExchangeParams): Promise<Transaction> {
    const { userId, fromCurrency, toCurrency, amount } = params;

    if (fromCurrency === toCurrency) {
      throw new BadRequestException(
        'Cannot exchange the same currency',
      );
    }

    const normalizedAmount = normalizeAmount(amount);

    //INTEGRATION POINT - Find accounts
    const fromAccount = await this.accountsService.findByUserIdAndCurrency(userId, fromCurrency);
    const toAccount = await this.accountsService.findByUserIdAndCurrency(userId, toCurrency);
    if (!fromAccount || !toAccount) {
      throw new NotFoundException('Account not found');
    }

    //INTEGRATION POINT - Validate account ownership
    await this.accountsService.validateAccountOwnership(fromAccount.id, userId);
    await this.accountsService.validateAccountOwnership(toAccount.id, userId);

    //INTEGRATION POINT - Validate sufficient funds
    await this.accountsService.validateSufficientFunds(fromAccount.id, normalizedAmount);

    const { exchangeRate, convertedAmount } = this.calculateExchange(
      fromCurrency,
      toCurrency,
      normalizedAmount,
    );

    const transaction = this.transactionRepository.create({
      userId,
      type: TransactionType.EXCHANGE,
      status: TransactionStatus.COMPLETED,
      amount: normalizedAmount,
      currency: fromCurrency,
      fromAccountId: fromAccount.id,
      toAccountId: toAccount.id,
      toUserId: null,
      exchangeRate,
      convertedAmount,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    //INTEGRATION POINT - Create ledger entries
    await this.ledgerService.createExchangeEntry(
      fromAccount.id,
      toAccount.id,
      normalizedAmount,
      convertedAmount,
      savedTransaction.id,
      fromCurrency,
      toCurrency,
    );

    return savedTransaction;
  }

  async findAll(params: FindAllParams): Promise<PaginatedResult<Transaction>> {
    const { userId, type, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId })
      .orderBy('transaction.createdAt', 'DESC');

    if (type) {
      queryBuilder.andWhere('transaction.type = :type', { type });
    }

    const [transactions, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      transactions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(
    transactionId: string,
    userId?: string,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with ID ${transactionId} not found`,
      );
    }

    if (userId && transaction.userId !== userId) {
      throw new ForbiddenException(
        `Transaction ${transactionId} does not belong to user ${userId}`,
      );
    }

    return transaction;
  }

  private calculateExchange(
    fromCurrency: Currency,
    toCurrency: Currency,
    amount: number,
  ): { exchangeRate: number; convertedAmount: number } {
    const baseRate = getExchangeRateConfig(this.configService);
    let exchangeRate: number;
    let convertedAmount: number;

    if (fromCurrency === Currency.USD && toCurrency === Currency.EUR) {
      exchangeRate = baseRate;
      convertedAmount = roundToTwoDecimals(amount * baseRate);
    } else if (fromCurrency === Currency.EUR && toCurrency === Currency.USD) {
      exchangeRate = 1 / baseRate;
      convertedAmount = roundToTwoDecimals(amount / baseRate);
    } else {
      throw new BadRequestException(
        `Unsupported currency pair: ${fromCurrency} to ${toCurrency}`,
      );
    }

    return {
      exchangeRate: roundToTwoDecimals(exchangeRate),
      convertedAmount,
    };
  }
}   