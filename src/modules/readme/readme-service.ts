import fs from 'fs/promises';

import { ActionResult } from '../../constants';
import ConfigProvider from '../../data-providers/config-provider';
import CommandService from './command-service';
import { ReadmeConfig } from './models';
import { ReadmeOptions } from './options';
import { README_DEFAULT_FILE, README_NAME } from './readme-constats';

export default class ReadmeService {
  private _cmdService: CommandService;
  private _configProvider: ConfigProvider;
  constructor() {
    this._cmdService = new CommandService();
    this._configProvider = new ConfigProvider();
  }

  public async initReadmeConfiguration(): Promise<ActionResult> {
    const exists = await this._configProvider.getConfig<ReadmeConfig>(
      README_NAME
    );

    if (exists !== undefined) {
      return {
        isSuccess: false,
        message: 'Mapping file already exists'
      };
    }

    const filePath = await this._configProvider.writeConfig(
      README_NAME,
      README_DEFAULT_FILE
    );
    return {
      isSuccess: true,
      message: `Created new mapping configuration file at: ${filePath}`
    };
  }

  async processReadMe(options: ReadmeOptions) {
    const fullFilePath = this._configProvider.getFullFilePath(options.input);
    let content = (await fs.readFile(fullFilePath)).toString();
    let matches = this._cmdService.getMatches(content);
    let count = 0;
    while (matches.length > 0) {
      if (count >= (process.env.AZEXT_MAX_README_ITERATION || 30)) {
        throw new Error(
          'Iteration count exceeded defined limit. Possible recursion. Please check your includes'
        );
      }
      count++;

      for (const match of matches) {
        if (match.content?.startsWith('#')) {
          const commandResult = this._cmdService.getCommand(match.content);

          if (commandResult && match.full) {
            const formatter = commandResult.command.formatter();
            const dd = formatter.getOptions({
              ...options,
              ...commandResult.options
            });
            const res = await formatter.getFormatted(dd);

            if (res !== undefined) {
              content = content.replace(match.full, res);
            }
          }
        }
      }
      matches = this._cmdService.getMatches(content);
    }
    return content;
  }
}
