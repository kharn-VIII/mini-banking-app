import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Account } from '../../accounts/entities/account.entity';
import { LedgerEntry } from '../../ledger/entities/ledger-entry.entity';
import { Currency } from '../../../common/enums/currency.enum';
import { TransactionType } from 'src/common/enums/transactions.enum';
import { TransactionStatus } from 'src/common/enums/transactions.enum';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.COMPLETED,
  })
  status: TransactionStatus;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: Currency,
    enumName: 'currency_enum',
  })
  currency: Currency;

  @Column({ type: 'uuid', nullable: true })
  fromAccountId: string | null;

  @Column({ type: 'uuid', nullable: true })
  toAccountId: string | null;

  @Column({ type: 'uuid', nullable: true })
  toUserId: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 4,
    nullable: true,
  })
  exchangeRate: number | null;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  convertedAmount: number | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Account, (account) => account.fromTransactions, {
    nullable: true,
  })
  @JoinColumn({ name: 'fromAccountId' })
  fromAccount: Account | null;

  @ManyToOne(() => Account, (account) => account.toTransactions, {
    nullable: true,
  })
  @JoinColumn({ name: 'toAccountId' })
  toAccount: Account | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'toUserId' })
  toUser: User | null;

  @OneToMany(() => LedgerEntry, (entry) => entry.transaction)
  ledgerEntries: LedgerEntry[];
}

