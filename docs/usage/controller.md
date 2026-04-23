# Controller

## Generate

```bash
node ace mojura:controller <name> <module> [--force]
```

```bash
node ace mojura:controller auth auth
# → app/modules/auth/controllers/auth_controller.ts
```

## Implementation

Controllers in Mojura are **ultra-thin**. They extend `MojuraController` and use the `serve()` method to delegate to Features.

```typescript
import { MojuraController } from '@mojura/adonisjs'
import LoginUserFeature from '../features/login_user_feature.js'
import LogoutUserFeature from '../features/logout_user_feature.js'
import ChangePasswordFeature from '../features/change_password_feature.js'
import GetProfileFeature from '../features/get_profile_feature.js'
import UpdateProfileFeature from '../features/update_profile_feature.js'

export default class AuthController extends MojuraController {
  async login() {
    return this.serve(LoginUserFeature)
  }

  async logout() {
    return this.serve(LogoutUserFeature)
  }

  async changePassword() {
    return this.serve(ChangePasswordFeature)
  }

  async profile() {
    return this.serve(GetProfileFeature)
  }

  async updateProfile() {
    return this.serve(UpdateProfileFeature)
  }
}
```

## Rules

1. **One Feature per method** — each controller method calls `serve()` once
2. **No business logic** — controllers do not validate, query, or transform data
3. **No direct response building** — the Feature handles the response

## The `serve()` Method

`serve()` instantiates the given Feature class and calls its `handle()` method with the current AdonisJS `HttpContext`.

```typescript
// What serve() does internally:
protected async serve(FeatureClass) {
  const feature = new FeatureClass()
  return await feature.handle(this.ctx)
}
```

## Static `serveWith()`

For functional route handlers (without class controllers), use `MojuraController.serveWith()`:

```typescript
import router from '@adonisjs/core/services/router'
import { MojuraController } from '@mojura/adonisjs'
import HealthCheckFeature from '#modules/system/features/health_check_feature'

router.get('/health', (ctx) => MojuraController.serveWith(HealthCheckFeature, ctx))
```
