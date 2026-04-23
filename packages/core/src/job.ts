/**
 * @mojura/core - Job
 *
 * Base class for synchronous Jobs in the Mojura Architecture.
 *
 * A Job is the fundamental unit of business logic.
 * Each Job executes a **single responsibility** — no more, no less.
 *
 * ## Principles
 * - A Job executes a Single Responsibility
 * - Jobs shall NOT call other Jobs
 * - Keep business logic concise and flat
 *
 * ## Usage
 * ```typescript
 * import { Job } from '@mojura/core'
 *
 * export class CreateUserJob extends Job<User> {
 *   constructor(private params: { name: string; email: string }) {
 *     super()
 *   }
 *
 *   async handle(): Promise<User> {
 *     const user = await User.create({
 *       name: this.params.name,
 *       email: this.params.email,
 *     })
 *     return user
 *   }
 * }
 * ```
 */

import type { JobInterface } from './types.js'

export abstract class Job<T = any> implements JobInterface<T> {
  /**
   * Execute the job's business logic.
   *
   * This method contains the single responsibility of the job.
   * It should be pure business logic with no HTTP concerns.
   *
   * @returns The result of the job execution.
   */
  abstract handle(): Promise<T> | T
}
