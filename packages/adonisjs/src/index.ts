/**
 * @mojura/adonisjs
 *
 * AdonisJS v7 adapter for the Mojura Architecture.
 *
 * Provides:
 * - MojuraController: Base controller with `serve()` method
 * - Ace CLI commands for scaffolding modules, features, jobs, and validators
 * - Stubs for code generation
 * - Service provider for AdonisJS integration
 *
 * ## Quick Start
 * ```bash
 * # Install
 * pnpm add @mojura/core @mojura/adonisjs
 *
 * # Configure
 * node ace configure @mojura/adonisjs
 *
 * # Generate a module
 * node ace mojura:module auth
 *
 * # Generate components
 * node ace mojura:feature LoginUser auth
 * node ace mojura:job AuthenticateUser auth
 * node ace mojura:validator LoginUser auth
 * ```
 *
 * @packageDocumentation
 */

export { MojuraController } from './controller.js'
export { Feature, Job, QueueableJob } from '@mojura/core'

export type {
  FeatureInterface,
  JobInterface,
  QueueableJobInterface,
  JobConstructor,
  QueueableJobConstructor,
  QueueAdapter,
  QueueDispatchOptions,
  MojuraConfig,
} from '@mojura/core'

export type { AdonisFeatureConstructor, MojuraAdonisConfig } from './types.js'
