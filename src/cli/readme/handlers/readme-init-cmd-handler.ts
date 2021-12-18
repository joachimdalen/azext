import { ReadmeInitOptions } from '../../../modules/readme/options';
import ReadmeService from '../../../modules/readme/readme-service';
import { BaseCommandHandler, GlobalOptions } from '../../models';

export default class ReadmeInitCmdHandler extends BaseCommandHandler<ReadmeInitOptions> {
  private _service: ReadmeService;
  constructor() {
    super();
    this._service = new ReadmeService();
  }
  async handleCommand(
    options: ReadmeInitOptions,
    globalOptions?: GlobalOptions
  ): Promise<void> {
    const result = await this._service.initReadmeConfiguration(options);

    this.writeResult(result, globalOptions);
  }
}
