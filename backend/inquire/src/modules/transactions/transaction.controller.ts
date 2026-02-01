import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { GetTransactionsQueryDto } from './dto/get-transactions-query.dto';
import { PaginatedTransactionsResponseDto } from './dto/paginated-transactions-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { roundToTwoDecimals } from '../../common/utils/currency.utils';

@ApiTags('transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('transfer')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Transfer money between users',
    description:
      'Transfers money from the current user to another user. ' +
      'Requires sufficient funds in the specified currency account.',
  })
  @ApiBody({ type: CreateTransferDto })
  @ApiResponse({
    status: 201,
    description: 'Transfer completed successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input or cannot transfer to same user',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing access token',
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found or user not found',
  })
  async transfer(
    @Body() createTransferDto: CreateTransferDto,
    @CurrentUser() currentUser: { id: string },
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionService.transfer({
      fromUserId: currentUser.id,
      toUserId: createTransferDto.toUserId,
      amount: createTransferDto.amount,
      currency: createTransferDto.currency,
    });

    return this.mapToResponseDto(transaction);
  }

  @Post('exchange')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Exchange currency within user accounts',
    description:
      'Exchanges currency from one account to another within the same user. ' +
      'Supports USD to EUR and EUR to USD conversions. ' +
      'Requires sufficient funds in the source currency account.',
  })
  @ApiBody({ type: CreateExchangeDto })
  @ApiResponse({
    status: 201,
    description: 'Exchange completed successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - invalid input, cannot exchange same currency, ' +
      'or unsupported currency pair',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing access token',
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found',
  })
  async exchange(
    @Body() createExchangeDto: CreateExchangeDto,
    @CurrentUser() currentUser: { id: string },
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionService.exchange({
      userId: currentUser.id,
      fromCurrency: createExchangeDto.fromCurrency,
      toCurrency: createExchangeDto.toCurrency,
      amount: createExchangeDto.amount,
    });

    return this.mapToResponseDto(transaction);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get transaction history with filters and pagination',
    description:
      'Retrieves paginated transaction history for the current user. ' +
      'Can be filtered by transaction type (transfer or exchange). ' +
      'Returns transactions ordered by creation date (newest first).',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['transfer', 'exchange'],
    description: 'Filter by transaction type',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully',
    type: PaginatedTransactionsResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing access token',
  })
  async getTransactions(
    @Query() query: GetTransactionsQueryDto,
    @CurrentUser() currentUser: { id: string },
  ): Promise<PaginatedTransactionsResponseDto> {
    const result = await this.transactionService.findAll({
      userId: currentUser.id,
      type: query.type,
      page: query.page,
      limit: query.limit,
    });

    return {
      transactions: result.transactions.map((t) => this.mapToResponseDto(t)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  private mapToResponseDto(transaction: any): TransactionResponseDto {
    return {
      id: transaction.id,
      type: transaction.type,
      status: transaction.status,
      amount: roundToTwoDecimals(Number(transaction.amount)),
      currency: transaction.currency,
      fromAccountId: transaction.fromAccountId,
      toAccountId: transaction.toAccountId,
      toUserId: transaction.toUserId,
      exchangeRate: transaction.exchangeRate
        ? roundToTwoDecimals(Number(transaction.exchangeRate))
        : null,
      convertedAmount: transaction.convertedAmount
        ? roundToTwoDecimals(Number(transaction.convertedAmount))
        : null,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }
}