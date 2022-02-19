import chalk from 'chalk';
import fs from 'fs/promises';

import ConfigProvider from '../../../data-providers/config-provider';
import { ReadmeOptions } from '../../../modules/readme/options';
import ReadmeService from '../../../modules/readme/readme-service';
import { BaseCommandHandler } from '../../models';

export default class ReadmeCmdHandler extends BaseCommandHandler<ReadmeOptions> {
  private _service: ReadmeService;
  private _configProvider: ConfigProvider;
  constructor() {
    super();
    this._service = new ReadmeService();
    this._configProvider = new ConfigProvider();
  }
  async handleCommand(options: ReadmeOptions): Promise<void> {
    const res = await this._service.processReadMe(options);

    const fullOutputPath = this._configProvider.getFullFilePath(options.output);
    await fs.writeFile(fullOutputPath, res);

    console.log(
      `Wrote updated README file to ${chalk.greenBright(fullOutputPath)}`
    );
  }
}
