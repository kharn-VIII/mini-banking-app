import { TransactionService } from "./transaction.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import { TransactionController } from "./transaction.controller";
import { AccountsModule } from "../accounts/accounts.module";
import { LedgerModule } from "../ledger/ledger.module";
import { UserModule } from "../users/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getJwtConfig } from "src/config/jwt.config";
import { JwtModule } from "@nestjs/jwt";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";


@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    AccountsModule,
    LedgerModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, JwtAuthGuard],
  exports: [TransactionService],
})
export class TransactionsModule {}