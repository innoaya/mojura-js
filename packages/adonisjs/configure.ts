/**
 * @mojura/adonisjs - Configure Hook
 *
 * Runs when a user executes: node ace configure @mojura/adonisjs
 *
 * This hook:
 * 1. Registers the Mojura provider in adonisrc.ts
 * 2. Registers Mojura Ace commands in adonisrc.ts
 * 3. Creates the app/modules/ directory
 */

import type Configure from '@adonisjs/core/commands/configure'
import { existsSync, mkdirSync } from 'node:fs'

export async function configure(command: Configure) {
  const codemods = await command.createCodemods()

  /**
   * Register the Mojura provider and commands in adonisrc.ts
   */
  await codemods.updateRcFile((rcFile) => {
    rcFile
      .addProvider('@mojura/adonisjs/mojura_provider')
      .addCommand('@mojura/adonisjs/commands')
  })

  /**
   * Create the modules directory if it doesn't exist
   */
  const modulesPath = command.app.makePath('app', 'modules')
  if (!existsSync(modulesPath)) {
    mkdirSync(modulesPath, { recursive: true })
    command.logger.action('create app/modules').succeeded()
  }

  command.logger.success('Mojura configured successfully!')
  command.logger.info('')
  command.logger.info('Get started with:')
  command.logger.info('  node ace mojura:module <module-name>')
  command.logger.info('')
  command.logger.info('Available commands:')
  command.logger.info('  node ace mojura:module      — Scaffold a full module')
  command.logger.info('  node ace mojura:controller   — Create a controller')
  command.logger.info('  node ace mojura:feature      — Create a feature')
  command.logger.info('  node ace mojura:job           — Create a job')
  command.logger.info('  node ace mojura:validator     — Create a validator')
}
