import { JwtModule } from "@nestjs/jwt";
import { AccountsController } from "./accounts.controller";
import { AccountsService } from "./accounts.service";
import { Account } from "./entities/account.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getJwtConfig } from "src/config/jwt.config";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: getJwtConfig,
      }),
    ],
  controllers: [AccountsController],
  providers: [AccountsService, JwtAuthGuard],
  exports: [AccountsService],
})
export class AccountsModule {}