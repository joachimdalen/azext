import fs from 'fs/promises';

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
    const mapping = await this._configProvider.getConfig<DefaultMapping>(
      MAPPING_NAME
    );

    if (mapping === undefined) {
      throw new Error('Failed to find mapping file');
    }

    const taskNameMapped = mapping.tasks[taskName];

    const taskPath = this._configProvider.getFullFilePath(taskNameMapped, true);

    const fileBuffer = await fs.readFile(taskPath);
    const fileContent: TaskDefinition = JSON.parse(fileBuffer.toString());
    return fileContent;
  }
  async getReadMeConfig(): Promise<ReadmeConfig | undefined> {
    const config = await this._configProvider.getConfig<ReadmeConfig>(
      README_NAME
    );
    return config;
  }

  parseVisibleRule(rule: string) {
    if (rule === '' || rule === undefined) return rule;

    const ruleParts = rule.split(' ');
    const parsed: string[] = [];

    const mapping: { [key: string]: string } = {
      '=': 'IS',
      '==': 'IS',
      '||': 'OR',
      '&&': 'AND',
      '!=': 'IS NOT'
    };

    for (const part of ruleParts) {
      const id = mapping[part];

      if (id === undefined) parsed.push('`' + part + '`');
      else parsed.push(id);
    }
    return parsed.join(' ');
  }
}
