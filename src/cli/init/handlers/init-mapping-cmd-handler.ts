import InitService from '../../../modules/init/init-service';
import { BaseCommandHandler, GlobalOptions } from '../../models';

export default class InitMappingCmdHandler extends BaseCommandHandler<unknown> {
  private _service: InitService;
  constructor() {
    super();
    this._service = new InitService();
  }
  async handleCommand(
    options: unknown,
    globalOptions?: GlobalOptions
  ): Promise<void> {
    const result = await this._service.initMappingConfiguration();

    this.writeResult(result, globalOptions);
  }
}
