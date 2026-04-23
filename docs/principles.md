# Principles

These six principles are the foundation of Mojura Architecture. Follow them strictly to maintain scalability, maintainability, and readability.

---

## 1. Feature Serves a Single Purpose

Each Feature handles exactly **one use case**. Favor creating many focused Features over complicating a single one.

✅ **Good:**
```
LoginUserFeature
LogoutUserFeature
ChangePasswordFeature
ForgotPasswordFeature
```

❌ **Bad:**
```
AuthFeature  ← handles login, logout, password change, forgot password
```

---

## 2. Job Executes a Single Responsibility

Each Job does **one thing**. A single responsibility can involve multiple related functions as long as they're part of the same cohesive responsibility.

✅ **Good:**
```typescript
class AuthenticateUserJob extends Job<User> {
  // Finds user and verifies password — one responsibility
}

class GenerateTokenJob extends Job<string> {
  // Creates and returns an access token — one responsibility
}
```

❌ **Bad:**
```typescript
class LoginAndSendEmailJob extends Job {
  // Authenticates AND sends email — two responsibilities
}
```

---

## 3. Modules Shouldn't Cross

Each module should be **self-contained** and should not perform tasks that belong to other modules.

✅ **Good:**
```
AuthModule handles authentication
TransactionModule handles transactions
MerchantModule handles merchant CRUD
```

❌ **Bad:**
```typescript
// Inside AuthModule
import { CreateTransactionJob } from '../transactions/jobs/...'
// AuthModule is reaching into TransactionModule
```

**For shared logic**, use utility classes, helpers, or shared services outside of any module.

---

## 4. Apply Decoupling Techniques

Use **shared utility and helper classes** for cross-cutting concerns. This enhances code reusability and maintainability.

```
app/
├── modules/          ← Domain-specific logic
│   ├── auth/
│   └── transactions/
├── services/         ← Shared services (crypto, audit, notification)
├── utils/            ← Utility functions (date helpers, formatters)
└── helpers/          ← Helper functions
```

---

## 5. Features Shall Not Call Other Features

A Feature can run as many Jobs as needed, but it must **never** call another Feature.

✅ **Good:**
```typescript
class CreateUserFeature extends Feature {
  async handle(ctx) {
    const user = await this.run(CreateUserJob, { ... })
    await this.run(AssignDefaultRoleJob, { userId: user.id })
    await this.runInQueue(SendWelcomeEmailJob, { ... })
    return ctx.response.created({ data: user })
  }
}
```

❌ **Bad:**
```typescript
class CreateUserFeature extends Feature {
  async handle(ctx) {
    const user = await this.run(CreateUserJob, { ... })
    await this.serve(SendWelcomeEmailFeature)  // ← WRONG! Feature calling Feature
  }
}
```

---

## 6. Jobs Shall Not Call Other Jobs

Keep your business logic **concise and flat**. Avoid nesting and coupling hell.

✅ **Good:**
```typescript
// Feature orchestrates multiple Jobs
class ProcessPaymentFeature extends Feature {
  async handle(ctx) {
    const validated = await this.run(ValidatePaymentJob, { ... })
    const transaction = await this.run(CreateTransactionJob, { ... })
    await this.run(UpdateBalanceJob, { ... })
    return ctx.response.ok({ data: transaction })
  }
}
```

❌ **Bad:**
```typescript
// Job calling another Job
class CreateTransactionJob extends Job {
  async handle() {
    const transaction = await Transaction.create(...)
    const balance = new UpdateBalanceJob({ ... })  // ← WRONG!
    await balance.handle()
  }
}
```

---

## 7. Write Code That Humans Can Read

> "Machines will run it nonetheless, it is us who will suffer."

- Use **descriptive names**: `CreateTransactionFeature`, not `TxnFeat`
- Follow the [Naming Convention](./naming-convention.md)
- Keep files small and focused
- Add JSDoc comments for complex business logic
