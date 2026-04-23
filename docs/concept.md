# Concept

## The Request Pipeline

Every request in Mojura flows through a strict 4-layer pipeline:

```
┌─────────┐     ┌────────────┐     ┌──────────┐     ┌────────┐
│  Route  │ ──→ │ Controller │ ──→ │ Feature  │ ──→ │ Job(s) │
└─────────┘     └────────────┘     └──────────┘     └────────┘
                                        │
                                        ├── run(Job) ──→ sync result
                                        │
                                        └── runInQueue(Job) ──→ async dispatch
```

## Layer Details

### Route
Maps a URL + HTTP method to a Controller method. No logic here — just wiring.

```typescript
// start/routes/auth.ts
import router from '@adonisjs/core/services/router'
const AuthController = () => import('#modules/auth/controllers/auth_controller')

router.group(() => {
  router.post('/login', [AuthController, 'login'])
  router.post('/logout', [AuthController, 'logout'])
}).prefix('/api/v1/auth')
```

### Controller
Ultra-thin dispatch layer. Each method calls `serve()` with exactly one Feature.

**Rules:**
- Controllers NEVER contain business logic
- Controllers NEVER validate requests
- Controllers ONLY call `serve()`

```typescript
import { MojuraController } from '@mojura/adonisjs'
import LoginUserFeature from '../features/login_user_feature.js'
import LogoutUserFeature from '../features/logout_user_feature.js'

export default class AuthController extends MojuraController {
  async login() {
    return this.serve(LoginUserFeature)
  }

  async logout() {
    return this.serve(LogoutUserFeature)
  }
}
```

### Feature
The orchestration layer. A Feature:
1. **Validates** the incoming request
2. **Runs** one or more synchronous Jobs via `run()`
3. **Dispatches** optional async Jobs via `runInQueue()`
4. **Returns** the HTTP response

```typescript
import { Feature } from '@mojura/core'
import type { HttpContext } from '@adonisjs/core/http'
import AuthenticateUserJob from '../jobs/authenticate_user_job.js'
import GenerateTokenJob from '../jobs/generate_token_job.js'
import NotifyLoginJob from '../jobs/notify_login_job.js'
import { loginValidator } from '../validators/auth_validator.js'

export default class LoginUserFeature extends Feature<HttpContext> {
  async handle(ctx: HttpContext) {
    // 1. Validate
    const payload = await ctx.request.validateUsing(loginValidator)

    // 2. Run sync Jobs
    const user = await this.run(AuthenticateUserJob, { ...payload })
    const token = await this.run(GenerateTokenJob, { userId: user.id })

    // 3. Dispatch async Job (non-blocking)
    await this.runInQueue(NotifyLoginJob, { userId: user.id, ip: ctx.request.ip() })

    // 4. Return response
    return ctx.response.ok({
      message: 'Logged in successfully',
      data: { access_token: token, user },
    })
  }
}
```

### Job
The business logic unit. Each Job has a **single responsibility**.

**Rules:**
- Jobs contain NO HTTP concerns (no request, no response)
- Jobs receive data through constructor params
- Jobs return data (or throw errors)
- Jobs do NOT call other Jobs

```typescript
import { Job } from '@mojura/core'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class AuthenticateUserJob extends Job<User> {
  constructor(private params: { identifier: string; password: string }) {
    super()
  }

  async handle(): Promise<User> {
    const user = await User.query()
      .where('email', this.params.identifier)
      .orWhere('username', this.params.identifier)
      .firstOrFail()

    const isValid = await hash.verify(user.password, this.params.password)
    if (!isValid) {
      throw new Error('Invalid credentials')
    }

    return user
  }
}
```

### QueueableJob
For tasks that should run in the background (emails, notifications, reports).

```typescript
import { QueueableJob } from '@mojura/core'

export default class NotifyLoginJob extends QueueableJob {
  static queue = 'notifications'
  static attempts = 3

  constructor(private params: { userId: string; ip: string }) {
    super()
  }

  async handle(): Promise<void> {
    // Send notification email, log audit event, etc.
  }
}
```

## Next Steps

- [Principles](./principles.md) — Rules to follow
- [Directory Structure](./directory-structure.md) — How to organize files
- [Setup](./setup.md) — Installation guide
