import fs from 'fs/promises';
import path from 'path';

import ConfigProvider from '../../data-providers/config-provider';
import { MAPPING_NAME } from '../init/init-constants';
import { DefaultMapping } from '../init/models';
import { TaskDefinition } from './models';
import { ReadmeConfig } from './models/readme-config';
import { README_NAME } from './readme-constats';

export default class TaskService {
  private _configProvider: ConfigProvider;

  constructor() {
    this._configProvider = new ConfigProvider();
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

    const taskPath = this._configProvider.getFullFilePath(taskNameMapped);

    const fileBuffer = await fs.readFile(taskPath);
    const fileContent: TaskDefinition = JSON.parse(fileBuffer.toString());
    return fileContent;
  }
  async getReadMeConfig(): Promise<ReadmeConfig | undefined> {
    const s: any = undefined;
    let fullPath = this._configProvider.getFullFilePath(s);

    if (fullPath && path.extname(fullPath) !== undefined) {
      fullPath = path.join(fullPath, README_NAME);
    }

    try {
      const fileBuffer = await fs.readFile(fullPath);
      const fileContent: ReadmeConfig = JSON.parse(fileBuffer.toString());
      return fileContent;
    } catch {
      console.error('err');
      return undefined;
    }
  }
}
