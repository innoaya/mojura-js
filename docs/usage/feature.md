# Feature

## Generate

```bash
node ace mojura:feature <name> <module> [--force]
```

```bash
node ace mojura:feature LoginUser auth
# → app/modules/auth/features/login_user_feature.ts
```

## Implementation

A Feature extends `Feature<HttpContext>` from `@mojura/core` and implements the `handle()` method.

### Basic Feature

```typescript
import { Feature } from '@mojura/core'
import type { HttpContext } from '@adonisjs/core/http'
import CreateUserJob from '../jobs/create_user_job.js'
import { createUserValidator } from '../validators/user_validator.js'

export default class CreateUserFeature extends Feature<HttpContext> {
  async handle(ctx: HttpContext) {
    // 1. Validate
    const payload = await ctx.request.validateUsing(createUserValidator)

    // 2. Run Job
    const user = await this.run(CreateUserJob, { ...payload })

    // 3. Return response
    return ctx.response.created({
      message: 'User created successfully',
      data: user,
    })
  }
}
```

### Feature with Multiple Jobs

```typescript
import { Feature } from '@mojura/core'
import type { HttpContext } from '@adonisjs/core/http'
import AuthenticateUserJob from '../jobs/authenticate_user_job.js'
import GenerateTokenJob from '../jobs/generate_token_job.js'
import NotifyLoginJob from '../jobs/notify_login_job.js'
import { loginValidator } from '../validators/auth_validator.js'

export default class LoginUserFeature extends Feature<HttpContext> {
  async handle(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(loginValidator)

    // Run multiple Jobs sequentially
    const user = await this.run(AuthenticateUserJob, {
      identifier: payload.identifier,
      password: payload.password,
    })

    const token = await this.run(GenerateTokenJob, {
      userId: user.id,
    })

    // Dispatch async Job (non-blocking)
    await this.runInQueue(NotifyLoginJob, {
      userId: user.id,
      ip: ctx.request.ip(),
    })

    return ctx.response.ok({
      message: 'Logged in successfully',
      data: { access_token: token, user },
    })
  }
}
```

### Feature with Error Handling

```typescript
import { Feature } from '@mojura/core'
import type { HttpContext } from '@adonisjs/core/http'
import AuthenticateUserJob from '../jobs/authenticate_user_job.js'

export default class LoginUserFeature extends Feature<HttpContext> {
  async handle(ctx: HttpContext) {
    try {
      const payload = await ctx.request.validateUsing(loginValidator)
      const data = await this.run(AuthenticateUserJob, { ...payload })

      return ctx.response.ok({ message: 'Success', data })
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        return ctx.response.unauthorized({ message: error.message })
      }
      throw error // Let the global exception handler handle it
    }
  }
}
```

## The `run()` Method

```typescript
const result = await this.run(SomeJob, { key: 'value' })
```

- Instantiates `SomeJob` with the provided params
- Calls `job.handle()` and returns the result
- Runs **synchronously** — waits for completion

## The `runInQueue()` Method

```typescript
await this.runInQueue(SomeQueueableJob, { key: 'value' })
await this.runInQueue(SomeQueueableJob, { key: 'value' }, { delay: 5000, queue: 'emails' })
```

- Dispatches the job to a background queue
- **Non-blocking** — does not wait for completion
- Requires a Queue Adapter to be configured
- Optional third parameter for queue-specific options

## Rules

1. **Single purpose** — one Feature handles one use case
2. **Features shall NOT call other Features**
3. **Validation happens here** — not in controllers or jobs
4. **Response building happens here** — not in jobs
