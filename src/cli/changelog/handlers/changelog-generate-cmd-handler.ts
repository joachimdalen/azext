import { logWarning, setVariable } from '../../../core/azure-devops-logger';
import {
  ADO_LATEST_VERSION,
  ADO_OUTPUT_PATH
} from '../../../modules/changelog/changelog-constants';
import ChangelogService from '../../../modules/changelog/changelog-service';
import { GenerateChangelogOptions } from '../../../modules/changelog/options';
import { BaseCommandHandler, GlobalOptions } from '../../models';

export default class ChangelogGenerateCmdHandler extends BaseCommandHandler<GenerateChangelogOptions> {
  private _service: ChangelogService;
  constructor() {
    super();
    this._service = new ChangelogService();
  }
  async handleCommand(
    options: GenerateChangelogOptions,
    globalOptions?: GlobalOptions
  ): Promise<void> {
    const result = await this._service.generate(options);
    if (globalOptions?.ci === 'ado') {
      if (result === undefined) {
        logWarning('Failed to generate changelog');
      } else {
        setVariable(ADO_LATEST_VERSION, result.latestVersion);
        setVariable(ADO_OUTPUT_PATH, result.outputPath);
      }
    }
  }
}
