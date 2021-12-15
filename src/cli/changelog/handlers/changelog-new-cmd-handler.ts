import chalk from 'chalk';
import ChangelogService from '../../../modules/changelog/ChangelogService';
import { BaseCommandHandler } from '../../models';

export interface NewChangelogOptions {
  output: string;
}

export default class NewChangelogCmdHandler extends BaseCommandHandler<NewChangelogOptions> {
  private _service: ChangelogService;
  constructor() {
    super();
    this._service = new ChangelogService();
  }
  async handleCommand(options: NewChangelogOptions): Promise<void> {
    const result = await this._service.createNewFile(options);    
    this.writeResult(result)
  }
}
