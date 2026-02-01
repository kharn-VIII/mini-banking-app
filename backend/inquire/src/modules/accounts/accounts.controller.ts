import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountResponseDto } from './dto/account-response.dto';
import { BalanceResponseDto } from './dto/balance-response.dto';
import { ReconciliationResponseDto } from './dto/reconciliation-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all accounts for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Accounts retrieved successfully',
    type: [AccountResponseDto],
  })
  async getAccounts(
    @CurrentUser() currentUser: { id: string },
  ): Promise<AccountResponseDto[]> {
    const accounts = await this.accountsService.findByUserId(currentUser.id);
    return accounts.map((account) => ({
      id: account.id,
      currency: account.currency,
      balance: Math.round(Number(account.balance) * 100) / 100,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    }));
  }

  @Get(':id/balance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the balance of an account' })
  @ApiResponse({
    status: 200,
    description: 'Balance retrieved successfully',
    type: BalanceResponseDto,
  })
  async getBalance(
    @Param('id') accountId: string,
    @CurrentUser() currentUser: { id: string },
  ): Promise<BalanceResponseDto> {
    await this.accountsService.validateAccountOwnership(
      accountId,
      currentUser.id,
    );
    const account = await this.accountsService.findById(accountId);
    const balance = await this.accountsService.getBalance(accountId);

    return {
      accountId: account.id,
      currency: account.currency,
      balance: balance,
    };
  }
  //create accounts endpoint for old users without accounts
//   @Post('create-accounts')
//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Create accounts for old users without accounts' })
//   @ApiResponse({
//     status: 200,
//     description: 'Accounts created successfully',
//     type: [AccountResponseDto],
//   })
//   async createAccounts(@CurrentUser() currentUser: { id: string }): Promise<AccountResponseDto[]> {
//     const accounts = await this.accountsService.createUserAccounts(currentUser.id);
//     return accounts.map((account) => ({
//       id: account.id,
//       currency: account.currency,
//       balance: Math.round(Number(account.balance) * 100) / 100,
//       createdAt: account.createdAt,
//       updatedAt: account.updatedAt,
//     }));
//   }
}