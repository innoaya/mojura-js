/**
 * @mojura/adonisjs - Types
 *
 * AdonisJS-specific type definitions for the Mojura Architecture.
 */

import type { HttpContext } from '@adonisjs/core/http'
import type { Feature } from '@mojura/core'

/**
 * Constructor type for Feature classes used in AdonisJS.
 * The Feature receives AdonisJS HttpContext.
 */
export type AdonisFeatureConstructor = new () => Feature<HttpContext>

/**
 * Mojura configuration for AdonisJS applications.
 */
export interface MojuraAdonisConfig {
  /**
   * The root directory for modules relative to the app root.
   * @default 'app/modules'
   */
  modulesPath: string
}

/**
 * Default Mojura configuration values for AdonisJS.
 */
export const defaultConfig: MojuraAdonisConfig = {
  modulesPath: 'app/modules',
}
