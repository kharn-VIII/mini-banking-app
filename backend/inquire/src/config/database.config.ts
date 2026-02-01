import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "../modules/users/entities/user.entity";
import { Account } from "../modules/accounts/entities/account.entity";
import { Transaction } from "../modules/transactions/entities/transaction.entity";
import { LedgerEntry } from "../modules/ledger/entities/ledger-entry.entity";


export async function getDatabaseConfig(
    configService: ConfigService
): Promise<TypeOrmModuleOptions> {
    return {
        type: 'postgres',
        host: configService.getOrThrow<string>('POSTGRES_HOST'),
        port: configService.getOrThrow<number>('POSTGRES_PORT'),
        username: configService.getOrThrow<string>('POSTGRES_USER'),
        password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
        database: configService.getOrThrow<string>('POSTGRES_DB'),
        entities: [User, Account, Transaction, LedgerEntry],
        synchronize: true,
    }
}