/**
 * mojura:controller command
 *
 * Generates a Mojura-style controller within a module.
 *
 * Usage:
 *   node ace mojura:controller <name> <module>
 *
 * Example:
 *   node ace mojura:controller auth auth
 *   → Creates: app/modules/auth/controllers/auth_controller.ts
 */

import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import { stubsRoot } from '../stubs/main.js'

export default class MojuraController extends BaseCommand {
  static commandName = 'mojura:controller'
  static description = 'Create a new Mojura controller within a module'

  static help = [
    'The mojura:controller command creates a controller that extends MojuraController:',
    '',
    '  {{ binaryName }} mojura:controller auth auth',
    '',
    'Generated file: app/modules/auth/controllers/auth_controller.ts',
  ]

  @args.string({
    description: 'Name of the controller (e.g., auth, transactions)',
  })
  declare name: string

  @args.string({
    description: 'Module to place the controller in (e.g., auth, transactions)',
  })
  declare module: string

  @flags.boolean({
    description: 'Force overwrite existing file',
    alias: 'f',
  })
  declare force: boolean

  async run() {
    const codemods = await this.createCodemods()

    await codemods.makeUsingStub(stubsRoot, 'controller.stub', {
      name: this.name,
      module: this.module.toLowerCase(),
      force: this.force,
    })
  }
}
