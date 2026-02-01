import { LedgerService } from "./ledger.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LedgerEntry } from "./entities/ledger-entry.entity";
import { AccountsModule } from "../accounts/accounts.module";


@Module({
  imports: [
    TypeOrmModule.forFeature([LedgerEntry]), 
    AccountsModule
  ],
  controllers: [],
  providers: [LedgerService],
  exports: [LedgerService],
})
export class LedgerModule {}