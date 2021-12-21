import ReadmeService from '../../../modules/readme/readme-service';
import { BaseCommandHandler, GlobalOptions } from '../../models';

export default class ReadmeInitCmdHandler extends BaseCommandHandler<unknown> {
  private _service: ReadmeService;
  constructor() {
    super();
    this._service = new ReadmeService();
  }
  async handleCommand(
    options: unknown,
    globalOptions?: GlobalOptions
  ): Promise<void> {
    const result = await this._service.initReadmeConfiguration();

    this.writeResult(result, globalOptions);
  }
}
