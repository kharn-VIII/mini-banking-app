import { InjectRepository } from '@nestjs/typeorm';
import { LedgerEntry, LedgerEntryType } from './entities/ledger-entry.entity';
import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Currency } from '../../common/enums/currency.enum';
import {
  roundToTwoDecimals,
  normalizeAmount,
} from '../../common/utils/currency.utils';
import { AccountsService } from '../accounts/accounts.service';

@Injectable()
export class LedgerService {
  constructor(
    @InjectRepository(LedgerEntry)
    private readonly ledgerEntryRepository: Repository<LedgerEntry>,
    private readonly dataSource: DataSource,
    private readonly accountsService: AccountsService,
  ) {}

  async createTransferEntry(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    transactionId: string,
    currency: Currency,
  ): Promise<LedgerEntry[]> {
    const normalizedAmount = normalizeAmount(amount);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const debitEntry = await this.createLedgerEntry(
        fromAccountId,
        transactionId,
        -normalizedAmount,
        LedgerEntryType.DEBIT,
        currency,
        queryRunner,
      );

      const creditEntry = await this.createLedgerEntry(
        toAccountId,
        transactionId,
        normalizedAmount,
        LedgerEntryType.CREDIT,
        currency,
        queryRunner,
      );

      const entries = [debitEntry, creditEntry];
      await this.validateTransactionBalance(transactionId, queryRunner);

      //INTEGRATION POINT - Update account balances with row-level locking
      await this.accountsService.updateBalanceInTransaction(
        fromAccountId,
        -normalizedAmount,
        queryRunner,
      );
      await this.accountsService.updateBalanceInTransaction(
        toAccountId,
        normalizedAmount,
        queryRunner,
      );

      await queryRunner.commitTransaction();
      return entries;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createExchangeEntry(
    fromAccountId: string,
    toAccountId: string,
    fromAmount: number,
    toAmount: number,
    transactionId: string,
    fromCurrency: Currency,
    toCurrency: Currency,
  ): Promise<LedgerEntry[]> {
    const normalizedFromAmount = normalizeAmount(fromAmount);
    const normalizedToAmount = normalizeAmount(toAmount);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const debitEntry = await this.createLedgerEntry(
        fromAccountId,
        transactionId,
        -normalizedFromAmount,
        LedgerEntryType.DEBIT,
        fromCurrency,
        queryRunner,
      );

      const creditEntry = await this.createLedgerEntry(
        toAccountId,
        transactionId,
        normalizedToAmount,
        LedgerEntryType.CREDIT,
        toCurrency,
        queryRunner,
      );

      const entries = [debitEntry, creditEntry];

      //INTEGRATION POINT - Update account balances with row-level locking
      await this.accountsService.updateBalanceInTransaction(
        fromAccountId,
        -normalizedFromAmount,
        queryRunner,
      );
      await this.accountsService.updateBalanceInTransaction(
        toAccountId,
        normalizedToAmount,
        queryRunner,
      );

      await queryRunner.commitTransaction();
      return entries;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findByTransactionId(transactionId: string): Promise<LedgerEntry[]> {
    return await this.ledgerEntryRepository.find({
      where: { transactionId },
      order: { createdAt: 'ASC' },
    });
  }

  async findByAccountId(
    accountId: string,
    options?: {
      limit?: number;
      offset?: number;
      fromDate?: Date;
      toDate?: Date;
    },
  ): Promise<LedgerEntry[]> {
    const queryBuilder = this.ledgerEntryRepository
      .createQueryBuilder('ledger')
      .where('ledger.accountId = :accountId', { accountId })
      .orderBy('ledger.createdAt', 'DESC');

    if (options?.fromDate) {
      queryBuilder.andWhere('ledger.createdAt >= :fromDate', {
        fromDate: options.fromDate,
      });
    }

    if (options?.toDate) {
      queryBuilder.andWhere('ledger.createdAt <= :toDate', {
        toDate: options.toDate,
      });
    }

    if (options?.limit) {
      queryBuilder.limit(options.limit);
    }

    if (options?.offset) {
      queryBuilder.offset(options.offset);
    }

    return await queryBuilder.getMany();
  }

  async validateTransactionBalance(
    transactionId: string,
    queryRunner?: any,
  ): Promise<void> {
    const repository = queryRunner
      ? queryRunner.manager.getRepository(LedgerEntry)
      : this.ledgerEntryRepository;

    const entries = await repository.find({
      where: { transactionId },
    });

    if (entries.length === 0) {
      throw new BadRequestException(
        `No ledger entries found for transaction ${transactionId}`,
      );
    }

    const sum = entries.reduce((total, entry) => {
      return roundToTwoDecimals(total + Number(entry.amount));
    }, 0);

    const roundedSum = roundToTwoDecimals(sum);

    if (Math.abs(roundedSum) > 0.01) {
      throw new BadRequestException(
        `Transaction ${transactionId} is not balanced. Sum: ${roundedSum}, expected: 0.00`,
      );
    }
  }

  async calculateBalanceFromLedger(accountId: string): Promise<number> {
    const result = await this.ledgerEntryRepository
      .createQueryBuilder('ledger')
      .select('SUM(ledger.amount)', 'sum')
      .where('ledger.accountId = :accountId', { accountId })
      .getRawOne();

    const sum = result?.sum || 0;
    return roundToTwoDecimals(Number(sum));
  }

  private async createLedgerEntry(
    accountId: string,
    transactionId: string,
    amount: number,
    type: LedgerEntryType,
    currency: Currency,
    queryRunner?: any,
  ): Promise<LedgerEntry> {
    const normalizedAmount = normalizeAmount(amount);
    const repository = queryRunner
      ? queryRunner.manager.getRepository(LedgerEntry)
      : this.ledgerEntryRepository;

    const entry = repository.create({
      accountId,
      transactionId,
      amount: normalizedAmount,
      type,
      currency,
    });

    return await repository.save(entry);
  }
}