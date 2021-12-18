import fs from 'fs/promises';

import CommandService from './command-service';

export default class ReadmeService {
  private _cmdService: CommandService;
  constructor() {
    this._cmdService = new CommandService();
  }
  async processReadMe(filePath: string) {
    let content = (await fs.readFile(filePath)).toString();

    const matches = this._cmdService.getMatches(content);

    for (const match of matches) {
      if (match.content?.startsWith('#')) {
        const commandResult = this._cmdService.getCommand(match.content);

        if (commandResult && match.full) {
          const formatter = commandResult.command.formatter();
          const dd = formatter.getOptions(commandResult.options);
          const res = await formatter.getFormatted(dd);

          if (res !== undefined) {
            content = content.replace(match.full, res);
          }
        }
      }
    }
    return content;
  }
}
