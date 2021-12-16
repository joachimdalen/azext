import ChangelogService from '../../../modules/changelog/changelog-service';
import { NewChangelogOptions } from '../../../modules/changelog/options';
import { BaseCommandHandler, GlobalOptions } from '../../models';

export default class NewChangelogCmdHandler extends BaseCommandHandler<NewChangelogOptions> {
  private _service: ChangelogService;
  constructor() {
    super();
    this._service = new ChangelogService();
  }
  async handleCommand(
    options: NewChangelogOptions,
    globalOptions?: GlobalOptions
  ): Promise<void> {
    const result = await this._service.createNewFile(options);
    this.writeResult(result);
  }
}
