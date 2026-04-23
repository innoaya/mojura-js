/**
 * @mojura/core - Types
 *
 * Shared type definitions for the Mojura Architecture.
 * These types are framework-agnostic and can be used across
 * any JavaScript/TypeScript framework adapter.
 */

/**
 * Constructor type for instantiating Job classes.
 * Enables the Feature's `run()` method to accept Job classes as arguments.
 */
export type JobConstructor<T = any> = new (params: Record<string, any>) => JobInterface<T>

/**
 * Constructor type for instantiating QueueableJob classes.
 * Enables the Feature's `runInQueue()` method to accept QueueableJob classes as arguments.
 */
export type QueueableJobConstructor = {
  new (params: Record<string, any>): QueueableJobInterface
  /** Queue name. */
  queue?: string
  /** Retry attempts. */
  attempts?: number
  /** Delay in ms. */
  delay?: number
}

/**
 * Interface that all synchronous Jobs must implement.
 * A Job is a single-responsibility unit of business logic.
 *
 * @example
 * ```typescript
 * class CreateUserJob implements JobInterface<User> {
 *   constructor(private params: { name: string; email: string }) {}
 *
 *   async handle(): Promise<User> {
 *     return await User.create(this.params)
 *   }
 * }
 * ```
 */
export interface JobInterface<T = any> {
  /**
   * Execute the job's business logic.
   * @returns The result of the job execution.
   */
  handle(): Promise<T> | T
}

/**
 * Interface that all queueable (async) Jobs must implement.
 * A QueueableJob is dispatched to a background queue for deferred processing.
 *
 * @example
 * ```typescript
 * class SendWelcomeEmailJob implements QueueableJobInterface {
 *   constructor(private params: { userId: string }) {}
 *
 *   async handle(): Promise<void> {
 *     // Send email in the background
 *   }
 * }
 * ```
 */
export interface QueueableJobInterface {
  /**
   * Execute the queueable job's logic.
   * Runs in a background worker/queue processor.
   */
  handle(): Promise<void> | void
}

/**
 * Interface that all Features must implement.
 * A Feature orchestrates validation, Job execution, and response building.
 *
 * The generic type parameter `TContext` allows each framework adapter
 * to define its own HTTP context type (e.g., AdonisJS HttpContext, Express Request/Response).
 *
 * @example
 * ```typescript
 * class LoginUserFeature implements FeatureInterface<HttpContext> {
 *   async handle(ctx: HttpContext): Promise<any> {
 *     const data = await this.run(LoginUserJob, { credentials: ctx.request.body() })
 *     return ctx.response.ok({ data })
 *   }
 * }
 * ```
 */
export interface FeatureInterface<TContext = any> {
  /**
   * Execute the feature's orchestration logic.
   * @param ctx - The framework-specific HTTP context.
   * @returns The HTTP response.
   */
  handle(ctx: TContext): Promise<any>
}

/**
 * Queue adapter interface for dispatching QueueableJobs.
 * Each framework adapter implements this to integrate with its queue system.
 *
 * @example
 * ```typescript
 * class BullQueueAdapter implements QueueAdapter {
 *   async dispatch(jobClass, params, options) {
 *     await bullQueue.add(jobClass.name, { jobClass, params }, options)
 *   }
 * }
 * ```
 */
export interface QueueAdapter {
  /**
   * Dispatch a QueueableJob to the background queue.
   * @param jobClass - The QueueableJob class constructor.
   * @param params - Parameters to pass to the job constructor.
   * @param options - Optional queue-specific options (delay, priority, etc.).
   */
  dispatch(
    jobClass: QueueableJobConstructor,
    params: Record<string, any>,
    options?: QueueDispatchOptions
  ): Promise<void>
}

/**
 * Options for dispatching a job to the queue.
 */
export interface QueueDispatchOptions {
  /** Queue name to dispatch to. Defaults to 'default'. */
  queue?: string
  /** Delay in milliseconds before the job should be processed. */
  delay?: number
  /** Job priority. Lower numbers = higher priority. */
  priority?: number
  /** Number of retry attempts on failure. */
  attempts?: number
  /** Custom job ID for deduplication. */
  jobId?: string
}

/**
 * Configuration options for the Mojura package.
 */
export interface MojuraConfig {
  /**
   * The root directory for modules.
   * Default: 'app/modules'
   */
  modulesPath?: string

  /**
   * Queue adapter for dispatching QueueableJobs.
   * If not provided, `runInQueue()` will throw an error.
   */
  queueAdapter?: QueueAdapter
}
