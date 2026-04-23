/**
 * @mojura/core
 *
 * Framework-agnostic core for the Mojura Architecture.
 *
 * Provides base classes for the Feature/Job pattern:
 * - Feature: Orchestrates validation, Job execution, and response building
 * - Job: Single-responsibility synchronous business logic
 * - QueueableJob: Single-responsibility asynchronous (queued) business logic
 *
 * ## Architecture Flow
 * ```
 * Route → Controller → Feature → Job(s) → Response
 * ```
 *
 * ## Quick Start
 * ```typescript
 * import { Feature, Job, QueueableJob } from '@mojura/core'
 * ```
 *
 * For framework-specific adapters, see:
 * - `@mojura/adonisjs` — AdonisJS v7 adapter
 *
 * @packageDocumentation
 */

export { Feature } from './feature.js'
export { Job } from './job.js'
export { QueueableJob } from './queueable_job.js'

export type {
  FeatureInterface,
  JobInterface,
  QueueableJobInterface,
  JobConstructor,
  QueueableJobConstructor,
  QueueAdapter,
  QueueDispatchOptions,
  MojuraConfig,
} from './types.js'
