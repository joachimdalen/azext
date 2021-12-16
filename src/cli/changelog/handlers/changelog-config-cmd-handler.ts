import ChangelogService from '../../../modules/changelog/changelog-service';
import { NewChangelogConfigOptions } from '../../../modules/changelog/options';
import { BaseCommandHandler } from '../../models';

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
