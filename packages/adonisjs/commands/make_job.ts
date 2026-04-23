/**
 * mojura:job command
 *
 * Generates a Mojura Job class within a module.
 *
 * Usage:
 *   node ace mojura:job <name> <module> [--queue]
 *
 * Example:
 *   node ace mojura:job AuthenticateUser auth
 *   → Creates: app/modules/auth/jobs/authenticate_user_job.ts
 *
 *   node ace mojura:job SendWelcomeEmail auth --queue
 *   → Creates: app/modules/auth/jobs/send_welcome_email_job.ts (QueueableJob)
 */

import { BaseCommand, args, flags } from '@adonisjs/core/ace'
import { stubsRoot } from '../stubs/main.js'

export default class MojuraJob extends BaseCommand {
  static commandName = 'mojura:job'
  static description = 'Create a new Mojura job within a module'

  static help = [
    'The mojura:job command creates a Job with single-responsibility logic:',
    '',
    '  {{ binaryName }} mojura:job AuthenticateUser auth',
    '',
    'For background/async jobs, use the --queue flag:',
    '',
    '  {{ binaryName }} mojura:job SendWelcomeEmail auth --queue',
    '',
    'Naming convention: [Operation][Subject]Job',
    '  Examples: AuthenticateUserJob, CreateTransactionJob, CalculateMDRJob',
  ]

  @args.string({
    description: 'Name of the job (e.g., AuthenticateUser, CreateTransaction)',
  })
  declare name: string

  @args.string({
    description: 'Module to place the job in (e.g., auth, transactions)',
  })
  declare module: string

  @flags.boolean({
    description: 'Create a queueable (async) job instead of a synchronous job',
    alias: 'q',
  })
  declare queue: boolean

  @flags.boolean({
    description: 'Force overwrite existing file',
    alias: 'f',
  })
  declare force: boolean

  async run() {
    const codemods = await this.createCodemods()
    const stubName = this.queue ? 'queueable_job.stub' : 'job.stub'

    await codemods.makeUsingStub(stubsRoot, stubName, {
      name: this.name,
      module: this.module.toLowerCase(),
      force: this.force,
    })
  }
}
