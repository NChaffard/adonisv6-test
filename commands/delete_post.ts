import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class DeletePost extends BaseCommand {
  static commandName = 'delete:post'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "DeletePost"')
  }
}
