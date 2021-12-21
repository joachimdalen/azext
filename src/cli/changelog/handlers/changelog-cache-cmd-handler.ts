import ChangelogService from '../../../modules/changelog/changelog-service';
import { CacheChangelogOptions } from '../../../modules/changelog/options';
import { BaseCommandHandler, GlobalOptions } from '../../models';

export default class CacheChangelogCmdHandler extends BaseCommandHandler<CacheChangelogOptions> {
  private _service: ChangelogService;
  constructor() {
    super();
    this._service = new ChangelogService();
  }
  async handleCommand(
    options: CacheChangelogOptions,
    globalOptions?: GlobalOptions
  ): Promise<void> {
    try {
      await this._service.populateCache(options);
      this.writeResult({ isSuccess: true, message: 'Updated cache' });
    } catch (error) {
      this.writeResult({ isSuccess: false, message: error as string });
    }
  }
}
