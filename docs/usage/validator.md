# Validator

## Generate

```bash
node ace mojura:validator <name> <module> [--force]
```

```bash
node ace mojura:validator LoginUser auth
# → app/modules/auth/validators/login_user_validator.ts
```

## Implementation

Validators use [VineJS](https://vinejs.dev) — AdonisJS's validation library. They export compiled validation schemas used inside Features.

### Basic Validator

```typescript
import vine from '@vinejs/vine'

export const loginUserValidator = vine.compile(
  vine.object({
    identifier: vine.string().trim().minLength(1),
    password: vine.string().minLength(6),
  })
)
```

### CRUD Validators

```typescript
import vine from '@vinejs/vine'

/**
 * Create merchant validator
 */
export const createMerchantValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255),
    email: vine.string().email(),
    phone: vine.string().trim().optional(),
    status: vine.enum(['active', 'inactive']),
  })
)

/**
 * Update merchant validator
 */
export const updateMerchantValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255).optional(),
    email: vine.string().email().optional(),
    phone: vine.string().trim().optional().nullable(),
    status: vine.enum(['active', 'inactive']).optional(),
  })
)

/**
 * Filter/search validator for listing
 */
export const listMerchantsValidator = vine.compile(
  vine.object({
    page: vine.number().positive().optional(),
    perPage: vine.number().positive().max(100).optional(),
    search: vine.string().trim().optional(),
    status: vine.enum(['active', 'inactive', 'all']).optional(),
    sortBy: vine.string().optional(),
    sortOrder: vine.enum(['asc', 'desc']).optional(),
  })
)
```

## Using Validators in Features

```typescript
import { Feature } from '@mojura/core'
import type { HttpContext } from '@adonisjs/core/http'
import CreateMerchantJob from '../jobs/create_merchant_job.js'
import { createMerchantValidator } from '../validators/merchant_validator.js'

export default class CreateMerchantFeature extends Feature<HttpContext> {
  async handle(ctx: HttpContext) {
    // Validate request data using the compiled validator
    const payload = await ctx.request.validateUsing(createMerchantValidator)

    // payload is now fully typed and validated
    const merchant = await this.run(CreateMerchantJob, { ...payload })

    return ctx.response.created({
      message: 'Merchant created',
      data: merchant,
    })
  }
}
```

## Where Validation Happens

In Mojura, validation happens in the **Feature** layer — not in controllers or jobs:

```
Controller  → No validation (just serves Feature)
Feature     → ✅ Validates here (using VineJS)
Job         → No validation (receives pre-validated data)
```

This keeps the responsibility chain clean:
- **Controller**: dispatch
- **Feature**: validate + orchestrate
- **Job**: execute business logic
