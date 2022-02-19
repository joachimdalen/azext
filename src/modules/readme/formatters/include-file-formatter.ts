import fs from 'fs/promises';
import { EOL } from 'os';

import ConfigProvider from '../../../data-providers/config-provider';
import { ReadmeConfig } from '../models';
import ReplacementCommandFormatter, {
  ReplacementOptions
} from '../models/replacement-command-formatter';
import TaskService from '../task-service';

export interface IncludeFileFormatterOptions {
  file: string;
  wrap?: string;
}

export default class IncludeFileFormatter extends ReplacementCommandFormatter<IncludeFileFormatterOptions> {
  private _service: TaskService;
  private _configProvider: ConfigProvider;
  constructor() {
    super();
    this._service = new TaskService();
    this._configProvider = new ConfigProvider();
  }
  async getFormatted(
    options: ReplacementOptions<IncludeFileFormatterOptions>
  ): Promise<any> {
    if (options.file === undefined) {
      throw new Error('Missing required properties: file');
    }

    const config = await this._service.getReadMeConfig();

    if (config) {
      const partialContent = await this.getPartialContent(config, options);
      return partialContent;
    }

    return undefined;
  }

  async getPartialContent(
    config: ReadmeConfig,
    options: IncludeFileFormatterOptions
  ) {
    if (config.partials === undefined) {
      throw new Error('Failed to find readme partials');
    }

    const partialPath = config.partials[options.file];

    if (partialPath === undefined) {
      throw new Error('No such partial ' + options.file);
    }
    const taskPath = this._configProvider.getFullFilePath(
      partialPath.file,
      true
    );

    const fileBuffer = await fs.readFile(taskPath);
    const fileContent: string = fileBuffer.toString();

    if (options.wrap) {
      return '```' + options.wrap + EOL + fileContent + EOL + '```';
    }

    return fileContent;
  }
}
