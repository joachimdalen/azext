import chalk from 'chalk';
import fs from 'fs/promises';

import { ReadmeOptions } from '../../../modules/readme/options';
import ReadmeService from '../../../modules/readme/readme-service';
import { BaseCommandHandler } from '../../models';

export default class ReadmeCmdHandler extends BaseCommandHandler<ReadmeOptions> {
  private _service: ReadmeService;
  constructor() {
    super();
    this._service = new ReadmeService();
  }
  async handleCommand(options: ReadmeOptions): Promise<void> {
    const res = await this._service.processReadMe(options.input);

    await fs.writeFile(options.output, res);

    console.log(
      `Wrote updated README file to ${chalk.greenBright(options.output)}`
    );
  }
}
