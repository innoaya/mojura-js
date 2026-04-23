/**
 * mojura:module command
 *
 * Generates a complete Mojura module scaffold with all subdirectories.
 *
 * Usage:
 *   node ace mojura:module <name>
 *
 * Example:
 *   node ace mojura:module auth
 *   → Creates: app/modules/auth/{controllers,features,jobs,validators}/
 */

import { BaseCommand, args } from '@adonisjs/core/ace'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

export default class MojuraModule extends BaseCommand {
  static commandName = 'mojura:module'
  static description = 'Create a new Mojura module with all subdirectories'

  static help = [
    'The mojura:module command creates a complete module scaffold:',
    '',
    '  {{ binaryName }} mojura:module auth',
    '',
    'This creates the following structure:',
    '  app/modules/auth/',
    '  ├── controllers/',
    '  ├── features/',
    '  ├── jobs/',
    '  └── validators/',
  ]

  @args.string({
    description: 'Name of the module (e.g., auth, transactions, merchants)',
  })
  declare name: string

  async run() {
    const moduleName = this.name.toLowerCase().replace(/module$/i, '')
    const modulesRoot = this.app.makePath('app', 'modules')
    const modulePath = join(modulesRoot, moduleName)

    const subdirs = ['controllers', 'features', 'jobs', 'validators']

    if (existsSync(modulePath)) {
      this.logger.warning(`Module "${moduleName}" already exists at ${modulePath}`)
      return
    }

    for (const subdir of subdirs) {
      const dirPath = join(modulePath, subdir)
      mkdirSync(dirPath, { recursive: true })
      this.logger.action(`create ${join('app', 'modules', moduleName, subdir)}`)
        .succeeded()
    }

    // Create a .gitkeep in each directory
    const { writeFileSync } = await import('node:fs')
    for (const subdir of subdirs) {
      writeFileSync(join(modulePath, subdir, '.gitkeep'), '')
    }

    this.logger.success(
      `Module "${moduleName}" created successfully at app/modules/${moduleName}/`
    )

    this.logger.info('Next steps:')
    this.logger.info(`  node ace mojura:controller ${moduleName} ${moduleName}`)
    this.logger.info(`  node ace mojura:feature Create${this.capitalize(moduleName)} ${moduleName}`)
    this.logger.info(`  node ace mojura:job Create${this.capitalize(moduleName)} ${moduleName}`)
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}
