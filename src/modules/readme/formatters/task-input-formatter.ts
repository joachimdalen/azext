import { EOL } from 'os';

import { isModuleInstalled } from '../../../core';
import Replacer from '../../../core/replacer';
import { TaskDefinition, TaskInputDefinition } from '../models';
import ReplacementCommandFormatter from '../models/replacement-command-formatter';
import { Table } from '../models/table';
import { TableHeader } from '../models/table-header';
import TaskService from '../task-service';

export interface TaskInputFormatterOptions {
  task: string;
  type: 'table' | 'example';
}

type TT = keyof TaskInputDefinition;
export default class TaskInputFormatter extends ReplacementCommandFormatter<TaskInputFormatterOptions> {
  private _service: TaskService;
  private _replacer: Replacer;
  private readonly codeFields: TT[] = ['name', 'defaultValue'];
  constructor() {
    super();
    this._service = new TaskService();
    this._replacer = new Replacer();
  }
  async getFormatted(options: TaskInputFormatterOptions): Promise<string> {
    const task = await this._service.getTaskDefinition(options.task);

    if (task === undefined) return '';
    if (task.inputs === undefined) return '';

    if (options.type === 'table') {
      const tbl = await this.getTable(task);
      return this._formatterService.formatTable(tbl);
    }
    return this.formatExample(task);
  }

  private formatExample(task: TaskDefinition) {
    let tbl = this.generateExample(task);

    if (isModuleInstalled('prettier')) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const prettier = require('prettier');
      tbl = prettier.format(tbl, { parser: 'yaml' });
    }
    return '```yaml' + EOL + tbl + EOL + '```';
  }

  private generateExample(task: TaskDefinition) {
    const parts = [];
    parts.push(
      `- task: ${task.friendlyName}@${task.version.Major}.${task.version.Minor}.${task.version.Patch}`
    );
    parts.push(`  inputs:`);
    task.inputs.forEach((ip) => {
      let base = `     ${ip.name}:`;

      if (ip.defaultValue !== undefined) {
        base = `${base} ${ip.defaultValue}`;
      }

      if (ip.helpMarkDown) {
        base = `${base} #${ip.helpMarkDown}`;
      }

      parts.push(base);
    });

    return parts.join(EOL);
  }

  private async getTable(task: TaskDefinition): Promise<Table> {
    const getBool = (s: any) => s as boolean;
    const config = await this._service.getReadMeConfig();

    if (config === undefined) {
      throw new Error('Failed to find readme config');
    }

    const headerKeys = config.includeInputsFields.map((x) => x.field);
    const headerInfo: TableHeader[] = config.includeInputsFields.map((x) => {
      return {
        align: x.align || 'left',
        title: x.title
      };
    });

    const rws = task.inputs.map((row) => {
      const b: string[] = [];
      headerKeys.map((rowKey: string) => {
        const key = rowKey as keyof TaskInputDefinition;
        const val = row[key];
        let inVal: any = '';
        if (val !== undefined) {
          if (this.codeFields.includes(key)) {
            inVal = '`' + row[key] + '`';
          } else {
            inVal = row[key];
          }
        }

        if (rowKey === 'required') {
          inVal = this._replacer.replaceEmojisIf(
            (getBool(inVal)
              ? config?.requiredOptions.true
              : config?.requiredOptions.false) || inVal,
            true
          );
        }

        if (rowKey === 'visibleRule') {
          inVal = this._service.parseVisibleRule(inVal);
        }

        if (rowKey === 'options') {
          inVal = this.formatOptions(inVal);
        }

        if (inVal === '') inVal = '--';

        b.push(inVal);
      });
      return b;
    });

    return {
      header: headerInfo,
      rows: rws
    };
  }
  private formatOptions(input: { [key: string]: string }) {
    return Object.keys(input)
      .map((k) => '`' + k + '`')
      .join(', ');
  }
}
