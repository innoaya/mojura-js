# Directory Structure

## AdonisJS Project with Mojura

```
your-project/
├── app/
│   ├── modules/                          ← Mojura modules
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   │   └── auth_controller.ts
│   │   │   ├── features/
│   │   │   │   ├── login_user_feature.ts
│   │   │   │   ├── logout_user_feature.ts
│   │   │   │   └── change_password_feature.ts
│   │   │   ├── jobs/
│   │   │   │   ├── authenticate_user_job.ts
│   │   │   │   ├── generate_token_job.ts
│   │   │   │   └── revoke_token_job.ts
│   │   │   └── validators/
│   │   │       └── auth_validator.ts
│   │   │
│   │   ├── transactions/
│   │   │   ├── controllers/
│   │   │   │   └── transactions_controller.ts
│   │   │   ├── features/
│   │   │   │   ├── list_transactions_feature.ts
│   │   │   │   ├── show_transaction_feature.ts
│   │   │   │   └── trigger_callback_feature.ts
│   │   │   ├── jobs/
│   │   │   │   ├── query_transactions_job.ts
│   │   │   │   ├── find_transaction_job.ts
│   │   │   │   └── send_callback_job.ts
│   │   │   └── validators/
│   │   │       └── transaction_validator.ts
│   │   │
│   │   ├── merchants/
│   │   │   ├── controllers/
│   │   │   ├── features/
│   │   │   ├── jobs/
│   │   │   └── validators/
│   │   │
│   │   └── settings/
│   │       ├── controllers/
│   │       ├── features/
│   │       ├── jobs/
│   │       └── validators/
│   │
│   ├── models/                           ← Shared Lucid models
│   │   ├── user.ts
│   │   ├── transaction.ts
│   │   └── merchant.ts
│   │
│   ├── middleware/                        ← Shared middleware
│   │   ├── auth_middleware.ts
│   │   └── ability_middleware.ts
│   │
│   ├── services/                         ← Shared services (cross-module)
│   │   ├── crypto_service.ts
│   │   └── audit_service.ts
│   │
│   ├── exceptions/                       ← Custom exceptions
│   │   └── handler.ts
│   │
│   └── utils/                            ← Utility functions
│       └── helpers.ts
│
├── config/                               ← Application config
│   ├── app.ts
│   ├── auth.ts
│   └── database.ts
│
├── database/                             ← Migrations & seeders
│   ├── migrations/
│   └── seeders/
│
├── start/                                ← Bootstrap files
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── transactions.ts
│   │   └── merchants.ts
│   ├── kernel.ts
│   └── env.ts
│
├── types/                                ← Shared TypeScript types
│   └── enum.ts
│
├── adonisrc.ts
├── tsconfig.json
├── package.json
└── .env
```

## Key Principles

### Models are Shared
Models live outside modules in `app/models/` because multiple modules may reference the same model (e.g., both `auth` and `transactions` need the `User` model).

### Services are Shared
Cross-cutting services (crypto, audit, notification) live in `app/services/` — not inside any module.

### Routes are Per-Module
Route files in `start/routes/` map 1:1 to modules for easy navigation.

### Each Module Has 4 Directories
Every module follows the same structure:
```
module_name/
├── controllers/    ← Ultra-thin controllers
├── features/       ← Request orchestration
├── jobs/           ← Business logic units
└── validators/     ← VineJS validation schemas
```
