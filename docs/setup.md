# Setup

## Installation

### AdonisJS v7

```bash
# Install packages
pnpm add @mojura/core @mojura/adonisjs

# Configure the AdonisJS adapter
node ace configure @mojura/adonisjs
```

The configure command will:
1. Register `@mojura/adonisjs/mojura_provider` in your `adonisrc.ts`
2. Register `@mojura/adonisjs/commands` for Ace CLI
3. Create the `app/modules/` directory

### Manual Configuration

If you prefer manual setup, add to your `adonisrc.ts`:

```typescript
import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  providers: [
    // ... other providers
    () => import('@mojura/adonisjs/mojura_provider'),
  ],
  commands: [
    // ... other commands
    () => import('@mojura/adonisjs/commands'),
  ],
})
```

## Creating Your First Module

```bash
# Scaffold the complete module
node ace mojura:module auth
```

This creates:
```
app/modules/auth/
├── controllers/.gitkeep
├── features/.gitkeep
├── jobs/.gitkeep
└── validators/.gitkeep
```

## Available CLI Commands

| Command | Description | Example |
|---|---|---|
| `mojura:module` | Create a full module scaffold | `node ace mojura:module auth` |
| `mojura:controller` | Create a controller in a module | `node ace mojura:controller auth auth` |
| `mojura:feature` | Create a feature in a module | `node ace mojura:feature LoginUser auth` |
| `mojura:job` | Create a job in a module | `node ace mojura:job AuthenticateUser auth` |
| `mojura:job --queue` | Create a queueable job | `node ace mojura:job SendEmail auth --queue` |
| `mojura:validator` | Create a validator in a module | `node ace mojura:validator LoginUser auth` |

## Full Example: Auth Module

```bash
# 1. Create the module
node ace mojura:module auth

# 2. Create the controller
node ace mojura:controller auth auth

# 3. Create features
node ace mojura:feature LoginUser auth
node ace mojura:feature LogoutUser auth

# 4. Create jobs
node ace mojura:job AuthenticateUser auth
node ace mojura:job GenerateToken auth
node ace mojura:job RevokeToken auth

# 5. Create validator
node ace mojura:validator LoginUser auth
```

Result:
```
app/modules/auth/
├── controllers/
│   └── auth_controller.ts
├── features/
│   ├── login_user_feature.ts
│   └── logout_user_feature.ts
├── jobs/
│   ├── authenticate_user_job.ts
│   ├── generate_token_job.ts
│   └── revoke_token_job.ts
└── validators/
    └── login_user_validator.ts
```

## Next Steps

- [Usage: Controller](./usage/controller.md)
- [Usage: Feature](./usage/feature.md)
- [Usage: Job](./usage/job.md)
