import fs from 'fs/promises';

import { ReadmeOptions } from '../../../modules/readme/options';
import TaskService from '../../../modules/readme/task-service';
import { BaseCommandHandler } from '../../models';

export default class ReadmeCmdHandler extends BaseCommandHandler<ReadmeOptions> {
  private _service: TaskService;
  constructor() {
    super();
    this._service = new TaskService();
  }
  async handleCommand(options: ReadmeOptions): Promise<void> {
    const res = await this._service.processReadMe(options.input);

    await fs.writeFile(options.output, res);

    console.log('res', res);
  }
}
