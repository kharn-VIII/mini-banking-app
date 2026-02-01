import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { AccountsModule } from "../accounts/accounts.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]), AccountsModule],
    controllers: [],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}