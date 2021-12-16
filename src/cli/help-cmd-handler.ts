import commandLineUsage from 'command-line-usage';
import {
  BaseCommandHandler,
  GlobalOptions,
  globalOptionsSection
} from './models';
export interface HelpOptions {}

export default class HelpCmdHandler extends BaseCommandHandler<HelpOptions> {
  async handleCommand(
    options: HelpOptions,
    globalOptions?: GlobalOptions
  ): Promise<void> {
    const data = this.commandOptions?.sections;
    if (data) {
      const usage = commandLineUsage([...data, globalOptionsSection]);
      console.log(usage);
    }
  }
}
