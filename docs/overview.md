# Overview

Mojura is a modular architecture designed for **scalability**, **maintainability**, and **readability** in JavaScript/TypeScript applications.

## The Problem

As applications grow, traditional MVC patterns lead to:
- **Fat controllers** with hundreds of lines of mixed validation, business logic, and response handling
- **Tightly coupled services** that become impossible to test in isolation
- **Unclear separation of concerns** — where does validation end and business logic begin?

## The Solution

Mojura introduces a clear **4-layer request pipeline**:

```
Route → Controller → Feature → Job(s) → Response
```

Each layer has a **single, well-defined responsibility**:

| Layer | Responsibility | Contains |
|---|---|---|
| **Route** | Map URL to handler | URL patterns, middleware |
| **Controller** | Dispatch to Feature | One-line `serve()` calls |
| **Feature** | Orchestrate the request | Validation, Job orchestration, response building |
| **Job** | Execute business logic | Single-responsibility pure logic |

## Why Mojura?

### Scalability
Each module (auth, transactions, merchants) is **self-contained** with its own controllers, features, jobs, and validators. New team members can work on one module without understanding the entire codebase.

### Maintainability
When a bug is reported in transaction processing, you know exactly where to look:
- `TransactionModule/features/CreateTransactionFeature.ts` — orchestration
- `TransactionModule/jobs/ValidatePaymentJob.ts` — the actual logic

### Readability
```typescript
// What does this controller do? It serves the LoginUser feature.
// That's it. No guessing, no scrolling.
export default class AuthController extends MojuraController {
  async login() {
    return this.serve(LoginUserFeature)
  }
}
```

## Packages

| Package | Purpose |
|---|---|
| `@mojura/core` | Framework-agnostic base classes — works everywhere |
| `@mojura/adonisjs` | AdonisJS v7 adapter with CLI commands |

## Next Steps

- [Concept](./concept.md) — Understanding the request pipeline
- [Setup](./setup.md) — Installation and configuration
- [Principles](./principles.md) — Architecture rules to follow
