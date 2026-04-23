/**
 * @mojura/adonisjs - Service Provider
 *
 * Registers Mojura commands and configuration with the AdonisJS application.
 */

import type { ApplicationService } from '@adonisjs/core/types'

export default class MojuraProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container.
   */
  register() {}

  /**
   * Boot the provider.
   */
  async boot() {}
}
