/**
 * @mojura/core - Feature
 *
 * Base class for Features in the Mojura Architecture.
 *
 * A Feature is the orchestration layer that:
 * 1. Receives the HTTP context from the Controller
 * 2. Validates the request
 * 3. Runs one or more Jobs (via `run()`)
 * 4. Optionally dispatches async Jobs (via `runInQueue()`)
 * 5. Builds and returns the HTTP response
 *
 * ## Principles
 * - A Feature serves a Single Purpose
 * - Features shall NOT call other Features
 * - Features orchestrate Jobs — they don't contain business logic themselves
 *
 * ## Usage
 * ```typescript
 * import { Feature } from '@mojura/core'
 * import { LoginUserJob } from '../jobs/login_user_job.js'
 * import { NotifyLoginJob } from '../jobs/notify_login_job.js'
 *
 * export class LoginUserFeature extends Feature {
 *   async handle(ctx: HttpContext) {
 *     const payload = await ctx.request.validateUsing(loginValidator)
 *
 *     const data = await this.run(LoginUserJob, { payload })
 *     await this.runInQueue(NotifyLoginJob, { userId: data.user.id })
 *
 *     return ctx.response.ok({ message: 'Logged in', data })
 *   }
 * }
 * ```
 */

import type {
  FeatureInterface,
  JobConstructor,
  QueueableJobConstructor,
  QueueAdapter,
  QueueDispatchOptions,
} from './types.js'
import { Job } from './job.js'
import { QueueableJob } from './queueable_job.js'

export abstract class Feature<TContext = any> implements FeatureInterface<TContext> {
  /**
   * Optional queue adapter for dispatching QueueableJobs.
   * Set by the framework adapter (e.g., @mojura/adonisjs).
   */
  protected queueAdapter?: QueueAdapter

  /**
   * Execute the feature's orchestration logic.
   *
   * This is the main entry point called by the Controller's `serve()` method.
   * Override this method to implement your feature's logic.
   *
   * @param ctx - The framework-specific HTTP context.
   * @returns The HTTP response.
   */
  abstract handle(ctx: TContext): Promise<any>

  /**
   * Run a synchronous Job and return its result.
   *
   * Creates an instance of the given Job class with the provided parameters,
   * then executes its `handle()` method and returns the result.
   *
   * @param JobClass - The Job class constructor.
   * @param params - Parameters to pass to the Job constructor.
   * @returns The result of the Job's `handle()` method.
   *
   * @example
   * ```typescript
   * const user = await this.run(CreateUserJob, { name: 'John', email: 'john@example.com' })
   * ```
   */
  protected async run<T>(JobClass: JobConstructor<T>, params: Record<string, any> = {}): Promise<T> {
    const job = new JobClass(params)

    if (!(job instanceof Job)) {
      throw new Error(
        `[Mojura] ${JobClass.name} must extend the Job base class from @mojura/core. ` +
        `Jobs executed via run() must be synchronous Job instances.`
      )
    }

    return await job.handle()
  }

  /**
   * Dispatch a QueueableJob to the background queue.
   *
   * Creates an instance of the given QueueableJob class and dispatches it
   * to the configured queue adapter for asynchronous processing.
   *
   * **Note:** Requires a QueueAdapter to be configured. If no adapter is set,
   * this method will throw an error.
   *
   * @param JobClass - The QueueableJob class constructor.
   * @param params - Parameters to pass to the QueueableJob constructor.
   * @param options - Optional queue dispatch options (overrides Job's static config).
   *
   * @example
   * ```typescript
   * await this.runInQueue(SendWelcomeEmailJob, { userId: user.id })
   * await this.runInQueue(GenerateReportJob, { reportId: 123 }, { delay: 5000 })
   * ```
   */
  protected async runInQueue(
    JobClass: QueueableJobConstructor,
    params: Record<string, any> = {},
    options?: QueueDispatchOptions
  ): Promise<void> {
    if (!this.queueAdapter) {
      throw new Error(
        `[Mojura] No queue adapter configured. ` +
        `To use runInQueue(), configure a QueueAdapter in your Mojura setup. ` +
        `See @mojura/adonisjs documentation for AdonisJS integration.`
      )
    }

    const job = new JobClass(params)

    if (!(job instanceof QueueableJob)) {
      throw new Error(
        `[Mojura] ${JobClass.name} must extend the QueueableJob base class from @mojura/core. ` +
        `Jobs dispatched via runInQueue() must be QueueableJob instances.`
      )
    }

    const resolvedOptions: QueueDispatchOptions = {
      queue: JobClass.queue ?? 'default',
      attempts: JobClass.attempts ?? 3,
      delay: JobClass.delay ?? 0,
      ...options,
    }

    await this.queueAdapter.dispatch(JobClass, params, resolvedOptions)
  }

  /**
   * Set the queue adapter for this Feature.
   * Called internally by framework adapters.
   * @internal
   */
  setQueueAdapter(adapter: QueueAdapter): void {
    this.queueAdapter = adapter
  }
}
