import commandLineUsage from 'command-line-usage';

import {
  BaseCommandHandler,
  GlobalOptions,
  globalOptionsSection
} from './models';

export default class HelpCmdHandler extends BaseCommandHandler<unknown> {
  async handleCommand(
    options: unknown,
    globalOptions?: GlobalOptions
  ): Promise<void> {
    const data = this.commandOptions?.sections;
    if (data) {
      const usage = commandLineUsage([...data, globalOptionsSection]);
      console.log(usage);
    }
  }
}
