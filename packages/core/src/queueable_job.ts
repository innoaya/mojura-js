/**
 * @mojura/core - QueueableJob
 *
 * Base class for asynchronous (queue-dispatched) Jobs in the Mojura Architecture.
 *
 * A QueueableJob is dispatched to a background queue via `runInQueue()`
 * inside a Feature. It runs asynchronously and does not block the HTTP response.
 *
 * ## Use Cases
 * - Sending emails or notifications
 * - Processing webhooks
 * - Generating reports
 * - Any task that shouldn't block the request lifecycle
 *
 * ## Usage
 * ```typescript
 * import { QueueableJob } from '@mojura/core'
 *
 * export class SendWelcomeEmailJob extends QueueableJob {
 *   constructor(private params: { userId: string; email: string }) {
 *     super()
 *   }
 *
 *   async handle(): Promise<void> {
 *     await emailService.send({
 *       to: this.params.email,
 *       template: 'welcome',
 *     })
 *   }
 * }
 * ```
 */

import type { QueueableJobInterface } from './types.js'

export abstract class QueueableJob implements QueueableJobInterface {
  /**
   * The queue name this job should be dispatched to.
   * Override to target a specific queue.
   * @default 'default'
   */
  static queue: string = 'default'

  /**
   * Number of retry attempts on failure.
   * Override to customize retry behavior.
   * @default 3
   */
  static attempts: number = 3

  /**
   * Delay in milliseconds before the job is processed.
   * Override to add a delay.
   * @default 0
   */
  static delay: number = 0

  /**
   * Execute the queueable job's logic.
   *
   * This method runs in a background worker/queue processor.
   * It should not return any value — its purpose is side effects
   * (sending emails, writing to external APIs, etc.).
   */
  abstract handle(): Promise<void> | void
}
