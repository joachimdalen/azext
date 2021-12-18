import fs from 'fs/promises';
import { EOL } from 'os';

import ConfigProvider from '../../../data-providers/config-provider';
import { ReadmeConfig } from '../models';
import ReplacementCommandFormatter from '../models/replacement-command-formatter';
import TaskService from '../task-service';

export interface IncludeFileFormatterOptions {
  file: string;
}

export default class IncludeFileFormatter extends ReplacementCommandFormatter<IncludeFileFormatterOptions> {
  private _service: TaskService;
  private _configProvider: ConfigProvider;
  constructor() {
    super();
    this._service = new TaskService();
    this._configProvider = new ConfigProvider();
  }
  async getFormatted(options: IncludeFileFormatterOptions): Promise<any> {
    if (options.file === undefined) {
      throw new Error('Missing required properties: file');
    }

    const config = await this._service.getReadMeConfig();

    if (config) {
      const partialContent = await this.getPartialContent(config, options.file);
      return partialContent;
    }

    return undefined;
  }

  async getPartialContent(config: ReadmeConfig, partialName: string) {
    if (config.partials === undefined) {
      throw new Error('Failed to readme partials');
    }

    const partialPath = config.partials[partialName];

    if (partialPath === undefined) {
      throw new Error('No such partial ' + partialName);
    }

    const taskPath = this._configProvider.getFullFilePath(partialPath.file);

    const fileBuffer = await fs.readFile(taskPath);
    const fileContent: string = fileBuffer.toString();

    if (partialPath.wrap) {
      return '```' + partialPath.wrap + EOL + fileContent + EOL + '```';
    }

    return fileContent;
  }
}
