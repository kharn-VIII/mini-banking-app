# Mini Banking Platform

A simplified banking platform demonstrating financial transaction handling, double-entry bookkeeping principles, and a user-friendly interface. The system maintains data integrity while providing a smooth user experience.

## Overview

This project implements a full-stack banking application with:
- **Backend**: NestJS RESTful API with PostgreSQL
- **Frontend**: React 19 with Vite, Tailwind CSS, and Redux Toolkit
- **Database**: PostgreSQL with double-entry ledger system
- **Authentication**: JWT-based security

## Features

### Core Functionality
- ✅ User registration and authentication (JWT)
- ✅ Double-entry ledger system for all transactions
- ✅ Account balance management (USD and EUR)
- ✅ Money transfers between users
- ✅ Currency exchange (USD ↔ EUR)
- ✅ Transaction history with filtering and pagination
- ✅ Real-time balance synchronization
- ✅ Concurrent transaction handling with pessimistic locking

### Security & Data Integrity
- ✅ Transaction atomicity (database transactions)
- ✅ Pessimistic row-level locking to prevent race conditions
- ✅ Balance validation before operations
- ✅ Insufficient funds protection
- ✅ Ledger-balance consistency checks

## Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL 16
- **ORM**: TypeORM
- **Authentication**: JWT (access + refresh tokens)
- **Validation**: class-validator, class-transformer
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## Project Structure

```
inquire/
├── backend/inquire/          # NestJS backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/         # Authentication
│   │   │   ├── users/        # User management
│   │   │   ├── accounts/     # Account operations
│   │   │   ├── transactions/ # Transaction operations
│   │   │   └── ledger/       # Double-entry ledger
│   │   ├── config/           # Configuration
│   │   └── common/           # Shared utilities
│   └── Dockerfile
├── frontend/inquire/          # React frontend
│   ├── src/
│   │   ├── api/              # API client
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom hooks
│   │   ├── store/            # Redux store
│   │   └── utils/            # Utilities
│   └── Dockerfile
├── docker-compose.yml        # Docker orchestration
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- PostgreSQL 16+ (if running locally)

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inquire
   ```

2. **Create `.env` file in the root directory**
   ```env
   # Database
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=inquire

   # JWT
   JWT_SECRET=your-secret-key-change-in-production
   JWT_ACCESS_TOKEN_EXPIRES_IN=15m
   JWT_REFRESH_TOKEN_EXPIRES_IN=7d

   # Exchange Rate
   EXCHANGE_RATE_USD_TO_EUR=0.92

   # CORS
   CORS_ORIGIN=http://localhost:5174

   # Frontend API URL
   VITE_API_BASE_URL=http://localhost:3000
   ```

3. **Start all services**
   ```bash
   docker-compose up -d --build
   ```

4. **Access the application**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend/inquire
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=inquire
   JWT_SECRET=your-secret-key
   JWT_ACCESS_TOKEN_EXPIRES_IN=15m
   JWT_REFRESH_TOKEN_EXPIRES_IN=7d
   EXCHANGE_RATE_USD_TO_EUR=0.92
   CORS_ORIGIN=http://localhost:5173
   PORT=3000
   ```

4. **Start PostgreSQL** (ensure it's running)

5. **Run the backend**
   ```bash
   npm run start:dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend/inquire
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. **Run the frontend**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173

## User Management Approach

**Option A: Registration Endpoint** ✅

The system implements user registration via `POST /auth/register`. Each new user automatically receives:
- 1 USD account with initial balance of $1,000.00
- 1 EUR account with initial balance of €500.00

Accounts are created automatically during user registration in a single database transaction to ensure consistency.

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

### Accounts
- `GET /accounts` - List user's accounts with balances
- `GET /accounts/:id/balance` - Get specific account balance

### Transactions
- `POST /transactions/transfer` - Transfer money between users
- `POST /transactions/exchange` - Exchange currency within user's accounts
- `GET /transactions` - List transactions with filters and pagination
  - Query params: `type` (transfer/exchange), `page`, `limit`

Full API documentation available at: http://localhost:3000/api

## Double-Entry Ledger Design

### Architecture

The system implements a **double-entry bookkeeping system** where:
- Every transaction creates **balanced ledger entries** (sum of amounts = 0)
- Ledger entries serve as the **authoritative audit trail**
- Account balances are maintained for performance but can be recalculated from ledger

### Database Schema

#### Ledger Entry Structure
```typescript
{
  id: UUID
  accountId: UUID          // Reference to account
  transactionId: UUID       // Reference to transaction
  amount: Decimal(15,2)     // Positive or negative
  type: 'debit' | 'credit'  // Entry type
  currency: 'USD' | 'EUR'   // Currency
  createdAt: Timestamp      // Audit timestamp
}
```

#### Transaction Examples

**Transfer $50 from User A to User B:**
```
| Account          | Amount  |
|------------------|---------|
| User A (USD)     | -50.00  |
| User B (USD)     | +50.00  |
| Sum              | 0.00    |
```

**Exchange $100 to €92 for User A:**
```
| Account          | Amount  |
|------------------|---------|
| User A (USD)     | -100.00 |
| User A (EUR)     | +92.00  |
| Sum              | 0.00    |
```

### Balance Consistency

The system maintains balance consistency through:

1. **Atomic Transactions**: All ledger entries and balance updates occur within a single database transaction
2. **Pessimistic Locking**: Row-level locks (`SELECT FOR UPDATE`) prevent concurrent modifications
3. **Validation**: Each transaction validates that ledger entries sum to zero
4. **Reconciliation**: `reconcileAccountBalance()` method can verify balance matches ledger sum

### Implementation Details

- **Ledger Service** (`ledger.service.ts`): Creates balanced entries for transfers and exchanges
- **Account Service** (`accounts.service.ts`): Updates balances with row-level locking
- **Transaction Service** (`transaction.service.ts`): Orchestrates transaction creation and ledger entries

All operations use TypeORM QueryRunner for transaction management, ensuring atomicity.

## Design Decisions & Trade-offs

### 1. Double-Entry Ledger
**Decision**: Implemented full double-entry system with ledger as source of truth
**Trade-off**: More complex than simple balance updates, but provides audit trail and data integrity

### 2. Pessimistic Locking
**Decision**: Used `SELECT FOR UPDATE` for account balance updates
**Trade-off**: Slightly slower than optimistic locking, but prevents race conditions in financial operations

### 3. Balance Storage
**Decision**: Store balances in accounts table for performance
**Trade-off**: Requires synchronization with ledger, but enables fast balance queries

### 4. User Registration (Option A)
**Decision**: Implemented registration endpoint instead of pre-seeded users
**Trade-off**: More flexible, but requires users to register before testing

### 5. JWT Authentication
**Decision**: JWT with refresh tokens stored in httpOnly cookies
**Trade-off**: Stateless authentication, but requires token refresh mechanism

### 6. TypeORM Synchronize
**Decision**: Used `synchronize: true` for development
**Trade-off**: Convenient for development, but should use migrations in production

## Known Limitations

1. **No Database Migrations**: Currently using TypeORM `synchronize` mode. Production should use migrations
2. **No Unit Tests**: Critical financial logic lacks automated tests
3. **Fixed Exchange Rate**: Exchange rate is hardcoded (0.92), not fetched from external API
4. **No Transaction Confirmation**: Transactions execute immediately without user confirmation step
5. **No Real-time Updates**: Balance updates require page refresh (no WebSockets)
6. **Limited Error Messages**: Some error messages could be more descriptive
7. **No Audit Log**: Separate audit log table not implemented (ledger serves as audit trail)

## Incomplete Features (Due to Time Constraints)

1. **Unit Tests**: No test coverage for critical financial logic
2. **Balance Reconciliation Endpoint**: Internal method exists but no public API endpoint
3. **Transaction Receipts Modal**: No detailed transaction view modal
4. **Real-time Balance Updates**: No WebSocket implementation
5. **Database Migrations**: No migration files, using synchronize
6. **Pre-seeded Users (Option B)**: Not implemented (chose Option A)

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens with expiration
- CORS configured for specific origins
- SQL injection protection via TypeORM parameterized queries
- Row-level locking prevents concurrent balance modifications

## Performance Considerations

- Indexes on ledger table: `accountId`, `transactionId`, `createdAt`
- Unique constraint on `(userId, currency)` for accounts
- Pagination for transaction history
- Balance stored in accounts table for fast queries

## Scaling Considerations

To scale for millions of users:

1. **Database Sharding**: Partition accounts by user ID ranges
2. **Read Replicas**: Use read replicas for balance queries
3. **Caching**: Cache frequently accessed balances (Redis)
4. **Message Queue**: Use queue for transaction processing
5. **Event Sourcing**: Consider event sourcing for audit trail
6. **Horizontal Scaling**: Stateless backend allows multiple instances

## Deployment

### Docker Deployment

The project includes Docker setup with proper service dependencies:
1. PostgreSQL starts first
2. Backend waits for database health check
3. Frontend waits for backend health check

### Production Considerations

- Change `JWT_SECRET` to strong random value
- Use database migrations instead of `synchronize`
- Configure proper CORS origins
- Set up SSL/TLS certificates
- Use environment-specific configuration
- Implement proper logging and monitoring
- Set up database backups

## Development

### Running Tests
```bash
# Backend
cd backend/inquire
npm run test

# Frontend
cd frontend/inquire
npm run test
```

### Code Style
- Backend: Follows NestJS conventions
- Frontend: Follows React best practices
- TypeScript strict mode enabled

## License

This project is created for assessment purposes.

