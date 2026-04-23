/**
 * mojura:feature command
 *
 * Generates a Mojura Feature class within a module.
 *
 * Usage:
 *   node ace mojura:feature <name> <module>
 *
 * Example:
 *   node ace mojura:feature LoginUser auth
 *   → Creates: app/modules/auth/features/login_user_feature.ts
 */

import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import { stubsRoot } from '../stubs/main.js'

export default class MojuraFeature extends BaseCommand {
  static commandName = 'mojura:feature'
  static description = 'Create a new Mojura feature within a module'

  static help = [
    'The mojura:feature command creates a Feature that orchestrates Jobs:',
    '',
    '  {{ binaryName }} mojura:feature LoginUser auth',
    '',
    'Generated file: app/modules/auth/features/login_user_feature.ts',
    '',
    'Naming convention: [Operation][Subject]Feature',
    '  Examples: LoginUserFeature, CreateTransactionFeature, ListMerchantsFeature',
  ]

  @args.string({
    description: 'Name of the feature (e.g., LoginUser, CreateTransaction)',
  })
  declare name: string

  @args.string({
    description: 'Module to place the feature in (e.g., auth, transactions)',
  })
  declare module: string

  @flags.boolean({
    description: 'Force overwrite existing file',
    alias: 'f',
  })
  declare force: boolean

  async run() {
    const codemods = await this.createCodemods()

    await codemods.makeUsingStub(stubsRoot, 'feature.stub', {
      name: this.name,
      module: this.module.toLowerCase(),
      force: this.force,
    })
  }
}
