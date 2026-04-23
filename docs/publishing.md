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

> **Note:** The `--access public` flag is required for scoped packages on the first publish. Subsequent publishes inherit the access level.

## Version Management

### Bumping Versions

```bash
# Patch release (1.0.0 → 1.0.1)
cd packages/core && npm version patch
cd packages/adonisjs && npm version patch

# Minor release (1.0.0 → 1.1.0)
cd packages/core && npm version minor
cd packages/adonisjs && npm version minor

# Major release (1.0.0 → 2.0.0)
cd packages/core && npm version major
cd packages/adonisjs && npm version major
```

### Keeping Versions in Sync

Both packages should be bumped together for consistency:

```bash
# Bump both packages to the same version
cd packages/core && npm version 1.1.0
cd packages/adonisjs && npm version 1.1.0

# Update @mojura/adonisjs dependency on @mojura/core
# In packages/adonisjs/package.json:
# "dependencies": { "@mojura/core": "^1.1.0" }
```

## Pre-Release Versions

For testing before a stable release:

```bash
# Beta release
cd packages/core && npm version 1.0.0-beta.1
npm publish --access public --tag beta

cd packages/adonisjs && npm version 1.0.0-beta.1
npm publish --access public --tag beta
```

Users install beta versions with:
```bash
pnpm add @mojura/core@beta @mojura/adonisjs@beta
```

## Using Local Packages (Development)

During development, use pnpm workspace linking instead of publishing:

### Link via pnpm workspace

In your `pgw-core` project's `package.json`:

```json
{
  "dependencies": {
    "@mojura/core": "workspace:*",
    "@mojura/adonisjs": "workspace:*"
  }
}
```

Or use npm link:

```bash
# In mojura/packages/core
npm link

# In mojura/packages/adonisjs
npm link

# In your project
npm link @mojura/core @mojura/adonisjs
```

### Alternative: File Path Reference

```json
{
  "dependencies": {
    "@mojura/core": "file:../mojura/packages/core",
    "@mojura/adonisjs": "file:../mojura/packages/adonisjs"
  }
}
```

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
- [ ] Version numbers are bumped correctly
- [ ] `package.json` exports are pointing to `build/` directory
- [ ] README.md is up to date
- [ ] CHANGELOG.md is updated (if maintained)
- [ ] `files` field in package.json includes only needed directories
