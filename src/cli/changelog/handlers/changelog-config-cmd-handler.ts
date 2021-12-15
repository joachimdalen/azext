import chalk from 'chalk';
import ChangelogService from '../../../modules/changelog/ChangelogService';
import { BaseCommandHandler } from '../../models';

export interface NewChangelogConfigOptions {
  outputDir: string;
  force: boolean;
}

export default class NewChangelogConfigCmdHandler extends BaseCommandHandler<NewChangelogConfigOptions> {
  private _service: ChangelogService;
  constructor() {
    super();
    this._service = new ChangelogService();
  }
  async handleCommand(options: NewChangelogConfigOptions): Promise<void> {
    const result = await this._service.createDefaultConfig(options);
    this.writeResult(result);
  }
}
