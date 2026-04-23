# Job

## Generate

```bash
# Synchronous Job
node ace mojura:job <name> <module> [--force]

# Queueable (async) Job
node ace mojura:job <name> <module> --queue [--force]
```

```bash
node ace mojura:job AuthenticateUser auth
# → app/modules/auth/jobs/authenticate_user_job.ts

node ace mojura:job SendWelcomeEmail auth --queue
# → app/modules/auth/jobs/send_welcome_email_job.ts (QueueableJob)
```

## Synchronous Job

A Job extends `Job<T>` from `@mojura/core` where `T` is the return type.

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

## Queueable Job

A QueueableJob extends `QueueableJob` from `@mojura/core`. It runs in the background.

```typescript
import { QueueableJob } from '@mojura/core'
import mail from '@adonisjs/mail/services/main'

export default class SendWelcomeEmailJob extends QueueableJob {
  static queue = 'emails'
  static attempts = 3
  static delay = 0

  constructor(private params: { email: string; name: string }) {
    super()
  }

  async handle(): Promise<void> {
    await mail.send((message) => {
      message
        .to(this.params.email)
        .subject('Welcome!')
        .htmlView('emails/welcome', { name: this.params.name })
    })
  }
}
```

## Using Jobs in Features

### Synchronous Job via `run()`
```typescript
// Creates job instance and awaits handle()
const user = await this.run(AuthenticateUserJob, {
  identifier: 'john@example.com',
  password: 'secret',
})
```

### Async Job via `runInQueue()`
```typescript
// Dispatches to background queue — non-blocking
await this.runInQueue(SendWelcomeEmailJob, {
  email: user.email,
  name: user.name,
})

// With custom options
await this.runInQueue(SendReminderEmailJob, { userId: user.id }, {
  delay: 3600000, // 1 hour delay
  queue: 'low-priority',
  attempts: 5,
})
```

## Job Design Patterns

### Database Operations
```typescript
export default class CreateTransactionJob extends Job<Transaction> {
  constructor(private params: {
    amount: number
    currency: string
    merchantId: string
  }) { super() }

  async handle(): Promise<Transaction> {
    return await Transaction.create({
      amount: this.params.amount,
      currency: this.params.currency,
      merchantId: this.params.merchantId,
      status: 'pending',
    })
  }
}
```

### External API Calls
```typescript
export default class VerifyPaymentWithProviderJob extends Job<PaymentResult> {
  constructor(private params: { transactionId: string; provider: string }) {
    super()
  }

  async handle(): Promise<PaymentResult> {
    const response = await fetch(`https://api.provider.com/verify`, {
      method: 'POST',
      body: JSON.stringify({ txn: this.params.transactionId }),
    })
    return await response.json()
  }
}
```

### Computation
```typescript
export default class CalculateMDRJob extends Job<MDRResult> {
  constructor(private params: { amount: number; channelId: string }) {
    super()
  }

  async handle(): Promise<MDRResult> {
    const mdrRule = await MdrRule.query()
      .where('channel_id', this.params.channelId)
      .where('is_active', true)
      .firstOrFail()

    const fee = this.params.amount * (mdrRule.rate / 100)
    return { fee, rate: mdrRule.rate, net: this.params.amount - fee }
  }
}
```

## Rules

1. **Single Responsibility** — one thing per Job
2. **No HTTP concerns** — no request/response objects
3. **Jobs shall NOT call other Jobs** — keep it flat
4. **Throw errors for failures** — let the Feature handle them
5. **Return data** — synchronous Jobs return their result
