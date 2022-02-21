import { EOL } from 'os';

import { isModuleInstalled } from '../../../core';
import { TaskDefinition, TaskInputType } from '../models';
import ReplacementCommandFormatter, {
  ReplacementOptions
} from '../models/replacement-command-formatter';
import { Table } from '../models/table';
import { TableHeader } from '../models/table-header';
import TaskService from '../task-service';

export interface TaskInputFormatterOptions {
  task: string;
  type: 'table' | 'example';
}

export default class TaskInputFormatter extends ReplacementCommandFormatter<TaskInputFormatterOptions> {
  private _service: TaskService;

  constructor() {
    super();
    this._service = new TaskService();
  }

  async getFormatted(
    options: ReplacementOptions<TaskInputFormatterOptions>
  ): Promise<string> {
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
      const prettier = require('prettier/standalone');
      const plugins = [require('prettier/parser-yaml')];
      tbl = prettier.format(tbl, { parser: 'yaml', plugins });
    }
    return '```yaml' + EOL + tbl + EOL + '```';
  }

  private generateExample(task: TaskDefinition) {
    const parts = [];
    parts.push(`- task: ${task.name}@${task.version.Major}`);
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
    const config = await this._service.getReadMeConfig();

    if (config === undefined) {
      throw new Error('Failed to find readme config');
    }

    const headers: TableHeader[] = [
      {
        title: 'Argument',
        align: 'left'
      },
      { title: 'Description', align: 'left' }
    ];

    const rws = task.inputs.map((row) => {
      const b: string[] = [];
      b.push('`' + row.name + '` <br />' + row.label);
      let inputString = row.required ? '**(Required)** ' : '**(Optional)** ';
      inputString =
        row.helpMarkDown !== undefined
          ? inputString + row.helpMarkDown + ' <br /> '
          : inputString + ' <br /> ';
      if (row.type === TaskInputType.PickList) {
        inputString =
          inputString + this.formatOptions(row.options) + ' <br /> ';
      }
      if (row.defaultValue) {
        inputString =
          inputString + 'Default value: ' + '`' + row.defaultValue + '`';
      }
      b.push(inputString);

      return b;
    });

    return {
      header: headers,
      rows: rws
    };
  }
  private formatOptions(input: { [key: string]: string }) {
    return `Options: ${Object.keys(input)
      .map((k) => '`' + k + '`')
      .join(', ')}`;
  }
}
