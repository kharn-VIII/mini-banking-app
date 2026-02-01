import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { LedgerEntry } from '../../ledger/entities/ledger-entry.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Currency } from '../../../common/enums/currency.enum';

@Entity('accounts')
@Unique(['userId', 'currency'])
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'enum',
    enum: Currency,
    enumName: 'currency_enum',
  })
  currency: Currency;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0.0,
  })
  balance: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => LedgerEntry, (entry) => entry.account)
  ledgerEntries: LedgerEntry[];

  @OneToMany(() => Transaction, (transaction) => transaction.fromAccount)
  fromTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.toAccount)
  toTransactions: Transaction[];
}

