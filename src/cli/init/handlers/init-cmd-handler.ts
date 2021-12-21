import chalk from 'chalk';

import InitService from '../../../modules/init/init-service';
import { InitOptions } from '../../../modules/init/options';
import { BaseCommandHandler } from '../../models';

export default class InitCmdHandler extends BaseCommandHandler<InitOptions> {
  private _service: InitService;
  constructor() {
    super();
    console.log('Creating init service');
    this._service = new InitService();
  }
  async handleCommand(options: InitOptions): Promise<void> {
    const path = await this._service.init(options);

    console.log(chalk.greenBright(`Created new AzExt folder at: ${path}`));
  }
}
