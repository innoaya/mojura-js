# Mojura for JavaScript

A modular architecture pattern for building scalable, maintainable, and readable JavaScript/TypeScript applications.

> **Inspired by [Mojura Architecture](https://mojura.innoaya.org)** — originally a Laravel package by InnoAya.
> This is the official JavaScript/TypeScript implementation with framework adapters.

## Packages

| Package | Description | Status |
|---|---|---|
| [`@mojura/core`](./packages/core) | Framework-agnostic base classes (Feature, Job, QueueableJob) | ✅ Ready |
| [`@mojura/adonisjs`](./packages/adonisjs) | AdonisJS v7 adapter with Ace CLI commands & stubs | ✅ Ready |
| `@mojura/nestjs` | NestJS adapter (planned) | 🔮 Future |
| `@mojura/express` | Express adapter (planned) | 🔮 Future |

## Architecture

```
Route → Controller → Feature → Job(s) → Response
```

- **Controller**: Ultra-thin — only calls `serve(Feature)`
- **Feature**: Orchestrates validation, Job execution, and response building
- **Job**: Single-responsibility business logic — no HTTP concerns
- **QueueableJob**: Background task dispatched via `runInQueue()`

## Quick Start (AdonisJS)

```bash
# Install
pnpm add @mojura/core @mojura/adonisjs

# Configure
node ace configure @mojura/adonisjs

# Scaffold a module
node ace mojura:module auth

# Generate components
node ace mojura:feature LoginUser auth
node ace mojura:job AuthenticateUser auth
node ace mojura:validator LoginUser auth
node ace mojura:controller auth auth
```

## Documentation

- [Overview](./docs/overview.md)
- [Concept](./docs/concept.md)
- [Principles](./docs/principles.md)
- [Naming Convention](./docs/naming-convention.md)
- [Directory Structure](./docs/directory-structure.md)
- [Setup](./docs/setup.md)
- **Usage Guide**
  - [Controller](./docs/usage/controller.md)
  - [Feature](./docs/usage/feature.md)
  - [Job](./docs/usage/job.md)
  - [Validator](./docs/usage/validator.md)
- [Publishing to npm](./docs/publishing.md)

## Core Principles

1. **Feature serves a Single Purpose** — favor many focused features over complex ones
2. **Job executes a Single Responsibility** — keep business logic concise and flat
3. **Modules shouldn't cross** — each module is self-contained
4. **Apply Decoupling Techniques** — use shared utilities for cross-cutting concerns
5. **Features shall not call other Features** — run Jobs, never Features
6. **Jobs shall not call other Jobs** — avoid nesting and coupling

## License

[Apache-2.0](./LICENSE)

## Credits

- Architecture concept by [InnoAya](https://innoaya.org)
- JavaScript implementation adapts the pattern for modern JS frameworks
