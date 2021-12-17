import chalk from 'chalk';
import InitService from '../../../modules/init/init-service';
import { InitOptions } from '../../../modules/init/options';
import { BaseCommandHandler, GlobalOptions } from '../../models';

export default class InitMappingCmdHandler extends BaseCommandHandler<InitOptions> {
  private _service: InitService;
  constructor() {
    super();
    this._service = new InitService();
  }
  async handleCommand(
    options: InitOptions,
    globalOptions?: GlobalOptions
  ): Promise<void> {
    const result = await this._service.initMappingConfiguration(options);

    this.writeResult(result, globalOptions);
  }
}
