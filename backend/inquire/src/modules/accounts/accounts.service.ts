import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Currency } from '../../common/enums/currency.enum';
import { InsufficientFundsException } from '../../common/exceptions/insufficient-funds.exception';
import {
  roundToTwoDecimals,
  normalizeAmount,
} from '../../common/utils/currency.utils';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly dataSource: DataSource,
  ) {}

  async createUserAccounts(userId: string): Promise<Account[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const usdAccount = await this.createAccount(
        userId,
        Currency.USD,
        1000.0,
      );
      const eurAccount = await this.createAccount(
        userId,
        Currency.EUR,
        500.0,
      );

      await queryRunner.commitTransaction();
      return [usdAccount, eurAccount];
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createAccount(
    userId: string,
    currency: Currency,
    initialBalance: number,
  ): Promise<Account> {
    const normalizedBalance = normalizeAmount(initialBalance);
    const account = this.accountRepository.create({
      userId,
      currency,
      balance: normalizedBalance,
    });
    return await this.accountRepository.save(account);
  }

  async findByUserId(userId: string): Promise<Account[]> {
    return await this.accountRepository.find({
      where: { userId },
      order: { currency: 'ASC' },
    });
  }

  async findById(accountId: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID ${accountId} not found`);
    }

    return account;
  }

  async findByUserIdAndCurrency(
    userId: string,
    currency: Currency,
  ): Promise<Account | null> {
    return await this.accountRepository.findOne({
      where: { userId, currency },
    });
  }

  async getBalance(accountId: string): Promise<number> {
    const account = await this.findById(accountId);
    return roundToTwoDecimals(Number(account.balance));
  }

  async validateSufficientFunds(
    accountId: string,
    amount: number,
  ): Promise<void> {
    const normalizedAmount = normalizeAmount(amount);
    const account = await this.findById(accountId);
    const balance = roundToTwoDecimals(Number(account.balance));

    if (balance < normalizedAmount) {
      throw new InsufficientFundsException(
        accountId,
        balance,
        normalizedAmount,
      );
    }
  }

  async updateBalance(accountId: string, amount: number): Promise<Account> {
    const normalizedAmount = normalizeAmount(amount);
    const account = await this.findById(accountId);
    const currentBalance = roundToTwoDecimals(Number(account.balance));
    const newBalance = roundToTwoDecimals(currentBalance + normalizedAmount);

    if (newBalance < 0) {
      throw new InsufficientFundsException(
        accountId,
        currentBalance,
        Math.abs(normalizedAmount),
      );
    }

    account.balance = newBalance;
    return await this.accountRepository.save(account);
  }

  async updateBalanceInTransaction(
    accountId: string,
    amount: number,
    queryRunner: any,
  ): Promise<Account> {
    const normalizedAmount = normalizeAmount(amount);
    const repository = queryRunner.manager.getRepository(Account);

    //SELECT FOR UPDATE - block row until transaction is completed
    const account = await repository
      .createQueryBuilder('account')
      .setLock('pessimistic_write')
      .where('account.id = :accountId', { accountId })
      .getOne();

    if (!account) {
      throw new NotFoundException(`Account with ID ${accountId} not found`);
    }

    const currentBalance = roundToTwoDecimals(Number(account.balance));
    const newBalance = roundToTwoDecimals(currentBalance + normalizedAmount);

    if (newBalance < 0) {
      throw new InsufficientFundsException(
        accountId,
        currentBalance,
        Math.abs(normalizedAmount),
      );
    }

    account.balance = newBalance;
    return await repository.save(account);
  }

  async validateAccountOwnership(
    accountId: string,
    userId: string,
  ): Promise<void> {
    const account = await this.findById(accountId);

    if (account.userId !== userId) {
      throw new ForbiddenException(
        `Account ${accountId} does not belong to user ${userId}`,
      );
    }
  }
}