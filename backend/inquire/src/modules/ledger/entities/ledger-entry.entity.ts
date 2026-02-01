import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Currency } from '../../../common/enums/currency.enum';

export enum LedgerEntryType {
  DEBIT = 'debit',
  CREDIT = 'credit',
}

@Entity('ledger')
@Index(['accountId', 'createdAt'])
@Index(['transactionId'])
@Index(['accountId', 'currency'])
export class LedgerEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  accountId: string;

  @Column({ type: 'uuid' })
  transactionId: string;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: LedgerEntryType,
    enumName: 'ledger_entry_type',
  })
  type: LedgerEntryType;

  @Column({
    type: 'enum',
    enum: Currency,
    enumName: 'currency_enum',
  })
  currency: Currency;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Account, (account) => account.ledgerEntries)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @ManyToOne(() => Transaction, (transaction) => transaction.ledgerEntries)
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;
}

