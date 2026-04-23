# Naming Convention

Consistent naming for files and classes ensures clarity and human readability.

## Classes (PascalCase)

| Component | Pattern | Examples |
|---|---|---|
| **Module** | `[Subject]` | `auth`, `transactions`, `merchants` |
| **Controller** | `[Subject]Controller` | `AuthController`, `TransactionsController` |
| **Feature** | `[Operation][Subject]Feature` | `LoginUserFeature`, `CreateTransactionFeature`, `ListMerchantsFeature` |
| **Job** | `[Operation][Subject]Job` | `AuthenticateUserJob`, `CreateTransactionJob`, `CalculateMDRJob` |
| **Validator** | `[operation][Subject]Validator` | `loginUserValidator`, `createTransactionValidator` |

## Files (snake_case)

| Component | Pattern | Examples |
|---|---|---|
| **Controller** | `[subject]_controller.ts` | `auth_controller.ts`, `transactions_controller.ts` |
| **Feature** | `[operation]_[subject]_feature.ts` | `login_user_feature.ts`, `create_transaction_feature.ts` |
| **Job** | `[operation]_[subject]_job.ts` | `authenticate_user_job.ts`, `create_transaction_job.ts` |
| **Validator** | `[subject]_validator.ts` | `auth_validator.ts`, `transaction_validator.ts` |

## Module Directories (snake_case)

```
app/modules/
├── auth/                    ← not "Auth" or "AuthModule"
├── transactions/            ← not "Transaction" or "TransactionModule"
├── merchants/
├── payment_channels/        ← use underscores for multi-word names
└── application_credentials/
```

## CRUD Operations

For standard CRUD operations, use these verbs consistently:

| Operation | Feature Name | Job Name |
|---|---|---|
| List | `ListUsersFeature` | `QueryUsersJob` |
| Show | `ShowUserFeature` | `FindUserJob` |
| Create | `CreateUserFeature` | `CreateUserJob` |
| Update | `UpdateUserFeature` | `UpdateUserJob` |
| Delete | `DeleteUserFeature` | `DeleteUserJob` |

## Custom Operations

For domain-specific operations, use descriptive verbs:

| Operation | Feature Name | Job Name |
|---|---|---|
| Login | `LoginUserFeature` | `AuthenticateUserJob` |
| Process Payment | `ProcessPaymentFeature` | `CreateTransactionJob` |
| Trigger Callback | `TriggerCallbackFeature` | `SendCallbackJob` |
| Calculate MDR | `CalculateMDRFeature` | `ComputeMDRRateJob` |
