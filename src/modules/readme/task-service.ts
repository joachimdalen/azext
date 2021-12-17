import fs from 'fs/promises';
import path from 'path';
import Replacer from '../../core/replacer';

import ConfigProvider from '../../data-providers/config-provider';
import { MAPPING_NAME } from '../init/init-constants';
import { DefaultMapping } from '../init/models';
import { TaskDefinition } from './models';

export default class TaskService {
  private _configProvider: ConfigProvider;
  private _replacer: Replacer;
  constructor() {
    this._configProvider = new ConfigProvider();
    this._replacer = new Replacer();
  }

  async processReadMe(filePath: string) {
    let content = (await fs.readFile(filePath)).toString();

    const matches = this._replacer.getMatches(content);

    for (const match of matches) {
      if (match.content?.startsWith('#')) {
        const commandResult = this._replacer.getCommand(match.content);

        if (commandResult && match.full) {
          const formatter = commandResult.command.formatter();
          const dd = formatter.getOptions(commandResult.options);
          const res = await formatter.getFormatted(dd);
          console.log(res);
          content = content.replace(match.full, res);
        }
      }
    }
    return content;
  }

  async getTaskDefinition(
    taskName: string
  ): Promise<TaskDefinition | undefined> {
    const s: any = undefined;
    let fullPath = this._configProvider.getFullFilePath(s);

    if (fullPath && path.extname(fullPath) !== undefined) {
      fullPath = path.join(fullPath, MAPPING_NAME);
    }

    const mapping = await this._configProvider.getConfig<DefaultMapping>(
      fullPath
    );

    if (mapping === undefined) {
      throw new Error('Failed to find mapping file');
    }

    const taskNameMapped = mapping.tasks[taskName];

    try {
      const fileBuffer = await fs.readFile(taskNameMapped);
      const fileContent: TaskDefinition = JSON.parse(fileBuffer.toString());
      return fileContent;
    } catch {
      return undefined;
    }
  }
}