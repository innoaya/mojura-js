# Publishing to npm

This guide covers how to publish `@mojura/core` and `@mojura/adonisjs` to the npm registry.

## Prerequisites

1. An [npm account](https://www.npmjs.com/signup)
2. An npm organization named `mojura` (for scoped packages)
3. Node.js 18+ and pnpm installed

## One-Time Setup

### 1. Login to npm

```bash
npm login
```

### 2. Create the Organization (if not yet created)

Go to [npmjs.com/org/create](https://www.npmjs.com/org/create) and create the `mojura` organization. This enables publishing `@mojura/*` scoped packages.

### 3. Verify Access

```bash
npm whoami
npm org ls mojura
```

## Publishing

### Build All Packages

```bash
# From the monorepo root
pnpm build
```

### Publish @mojura/core First

Core must be published before AdonisJS adapter (because it depends on it).

```bash
cd packages/core
npm publish --access public
```

### Publish @mojura/adonisjs

After core is published:

```bash
cd packages/adonisjs
npm publish --access public
```

> [!IMPORTANT]
> The `--access public` flag is required for scoped packages on the first publish. Subsequent publishes inherit the access level.

> [!WARNING]
> **Do NOT use `workspace:*` in dependencies when publishing with `npm publish`.**
> The `workspace:` protocol is a pnpm monorepo feature — `npm publish` publishes it as a literal string, which breaks installation. Always use a real semver range (e.g., `"^1.0.0"`) in the `dependencies` field before publishing.
> If you use `pnpm publish`, it auto-replaces `workspace:*` with the actual version — but using explicit versions is safer and more predictable.

## Version Management

### Independent Versioning

Each package has its **own independent version number**. They do NOT need to match.

```
@mojura/core     → 1.0.0
@mojura/adonisjs → 1.0.1   ← This is perfectly fine
```

This is standard practice for npm packages — even official AdonisJS packages have independent versions (`@adonisjs/core@7.3.1`, `@adonisjs/lucid@21.6.1`, etc.).

**What matters** is the dependency constraint in `@mojura/adonisjs`:
```json
{
  "dependencies": {
    "@mojura/core": "^1.0.0"
  }
}
```

The `^1.0.0` range means "any version `>=1.0.0` and `<2.0.0`" — so `@mojura/core@1.0.0`, `1.0.5`, `1.2.0` etc. all satisfy it.

### When to Bump Each Package

| Scenario | Package to bump |
|---|---|
| Changed Feature/Job/QueueableJob base classes | `@mojura/core` |
| Changed Ace commands, stubs, controller, or provider | `@mojura/adonisjs` |
| Changed both | Bump both independently |

### Bumping Versions

```bash
# Patch release (bug fix: 1.0.0 → 1.0.1)
npm version patch

# Minor release (new feature, backward-compatible: 1.0.0 → 1.1.0)
npm version minor

# Major release (breaking change: 1.0.0 → 2.0.0)
npm version major
```

### When to Update the Dependency Range

Only update the `@mojura/core` dependency in `@mojura/adonisjs` when:
- A **new core feature** is required by the adapter (bump minor, update range)
- A **breaking change** is made to core (bump major, update range)

```json
// If @mojura/core releases 2.0.0 with breaking changes:
{
  "dependencies": {
    "@mojura/core": "^2.0.0"
  }
}
```

## Pre-Release Versions

For testing before a stable release:

```bash
# Beta release
cd packages/core && npm version 1.1.0-beta.1
npm publish --access public --tag beta

cd packages/adonisjs && npm version 1.1.0-beta.1
npm publish --access public --tag beta
```

Users install beta versions with:
```bash
pnpm add @mojura/core@beta @mojura/adonisjs@beta
```

## Using Local Packages (Development)

During development, use local references instead of publishing.

### Option A: File Path Reference (Recommended)

In your project's `package.json`:

```json
{
  "dependencies": {
    "@mojura/core": "file:../mojura/packages/core",
    "@mojura/adonisjs": "file:../mojura/packages/adonisjs"
  }
}
```

### Option B: npm link

```bash
# In mojura/packages/core
npm link

# In mojura/packages/adonisjs
npm link

# In your project
npm link @mojura/core @mojura/adonisjs
```

### Option C: pnpm workspace (monorepo only)

If your project is inside the same monorepo:

```json
{
  "dependencies": {
    "@mojura/core": "workspace:*",
    "@mojura/adonisjs": "workspace:*"
  }
}
```

> [!CAUTION]
> `workspace:*` only works inside pnpm workspaces. Never publish a package with `workspace:*` using `npm publish` — it will break installation for consumers.

## Automated Publishing (CI/CD)

For automated publishing with GitHub Actions:

```yaml
# .github/workflows/publish.yml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          registry-url: 'https://registry.npmjs.org'

      - run: pnpm install
      - run: pnpm build

      - run: cd packages/core && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - run: cd packages/adonisjs && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Checklist Before Publishing

- [ ] All tests pass
- [ ] `pnpm build` succeeds with no errors
- [ ] Version number is bumped (npm rejects duplicate versions)
- [ ] `package.json` dependencies use real semver ranges (no `workspace:*`)
- [ ] `package.json` exports point to `build/` directory
- [ ] README.md is up to date
- [ ] `files` field in package.json includes only needed directories
