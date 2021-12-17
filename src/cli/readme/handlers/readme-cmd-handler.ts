import fs from 'fs/promises';
import { ReadmeOptions } from '../../../modules/readme/options';
import TaskService from '../../../modules/readme/task-service';
import { BaseCommandHandler, GlobalOptions } from '../../models';

export default class ReadmeCmdHandler extends BaseCommandHandler<ReadmeOptions> {
  private _service: TaskService;
  constructor() {
    super();
    this._service = new TaskService();
  }
  async handleCommand(
    options: ReadmeOptions,
    globalOptions?: GlobalOptions
  ): Promise<void> {
    const res = await this._service.processReadMe(
      ''
    );

    await fs.writeFile(
      '',
      res
    );

    console.log('res', res);
  }
}
