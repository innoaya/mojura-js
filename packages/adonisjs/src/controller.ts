/**
 * @mojura/adonisjs - MojuraController
 *
 * Base controller class for AdonisJS that implements the Mojura pattern.
 *
 * Controllers in Mojura are ultra-thin — they only call `serve()` to
 * delegate to a Feature class. All business logic, validation, and
 * response building happens inside the Feature.
 *
 * ## Usage
 * ```typescript
 * import { MojuraController } from '@mojura/adonisjs'
 * import { LoginUserFeature } from '../features/login_user_feature.js'
 * import { LogoutUserFeature } from '../features/logout_user_feature.js'
 *
 * export default class AuthController extends MojuraController {
 *   async login() {
 *     return this.serve(LoginUserFeature)
 *   }
 *
 *   async logout() {
 *     return this.serve(LogoutUserFeature)
 *   }
 * }
 * ```
 */

import type { HttpContext } from '@adonisjs/core/http'
import type { Feature } from '@mojura/core'

export class MojuraController {
  /**
   * The current HTTP context.
   * Set by AdonisJS when the controller method is called.
   */
  protected ctx!: HttpContext

  /**
   * Serve a Feature — the core Mojura dispatch method.
   *
   * Instantiates the given Feature class and executes its `handle()` method
   * with the current AdonisJS HttpContext.
   *
   * @param FeatureClass - The Feature class to instantiate and execute.
   * @returns The result of the Feature's `handle()` method.
   *
   * @example
   * ```typescript
   * async store() {
   *   return this.serve(CreateUserFeature)
   * }
   * ```
   */
  protected async serve<T extends Feature<HttpContext>>(
    FeatureClass: new () => T
  ): Promise<any> {
    const feature = new FeatureClass()
    return await feature.handle(this.ctx)
  }

  /**
   * Serve a Feature with the given HTTP context.
   *
   * Use this when you need to explicitly pass the context
   * (e.g., in functional route handlers or middleware).
   *
   * @param FeatureClass - The Feature class to instantiate and execute.
   * @param ctx - The AdonisJS HTTP context.
   * @returns The result of the Feature's `handle()` method.
   *
   * @example
   * ```typescript
   * // In a functional route handler
   * router.post('/login', async (ctx) => {
   *   return MojuraController.serveWith(LoginUserFeature, ctx)
   * })
   * ```
   */
  static async serveWith<T extends Feature<HttpContext>>(
    FeatureClass: new () => T,
    ctx: HttpContext
  ): Promise<any> {
    const feature = new FeatureClass()
    return await feature.handle(ctx)
  }
}
