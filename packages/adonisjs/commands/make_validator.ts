/**
 * mojura:validator command
 *
 * Generates a Mojura validator (VineJS schema) within a module.
 *
 * Usage:
 *   node ace mojura:validator <name> <module>
 *
 * Example:
 *   node ace mojura:validator LoginUser auth
 *   → Creates: app/modules/auth/validators/login_user_validator.ts
 */

import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import { stubsRoot } from '../stubs/main.js'

export default class MojuraValidator extends BaseCommand {
  static commandName = 'mojura:validator'
  static description = 'Create a new Mojura validator within a module'

  static help = [
    'The mojura:validator command creates a VineJS validation schema:',
    '',
    '  {{ binaryName }} mojura:validator LoginUser auth',
    '',
    'Generated file: app/modules/auth/validators/login_user_validator.ts',
    '',
    'Naming convention: [Operation][Subject]Validator',
    '  Examples: LoginUserValidator, CreateTransactionValidator',
  ]

  @args.string({
    description: 'Name of the validator (e.g., LoginUser, CreateTransaction)',
  })
  declare name: string

  @args.string({
    description: 'Module to place the validator in (e.g., auth, transactions)',
  })
  declare module: string

  @flags.boolean({
    description: 'Force overwrite existing file',
    alias: 'f',
  })
  declare force: boolean

  async run() {
    const codemods = await this.createCodemods()

    await codemods.makeUsingStub(stubsRoot, 'validator.stub', {
      name: this.name,
      module: this.module.toLowerCase(),
      force: this.force,
    })
  }
}
