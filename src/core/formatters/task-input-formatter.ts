import { EOL } from 'os';

import {
  TaskDefinition,
  TaskInputDefinition
} from '../../modules/readme/models';
import TaskService from '../../modules/readme/task-service';
import { isModuleInstalled } from '..';
import ReplacementCommandFormatter from '../models/replacement-command-formatter';
import Replacer from '../replacer';

export interface TaskInputFormatterOptions {
  task: string;
  type: 'table' | 'example';
}

interface Table {
  headers: Record<string, string>;
  rows: TaskInputDefinition[];
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
      return this.formatTable(task);
    }
    return this.formatExample(task);
  }

  private formatExample(task: TaskDefinition) {
    let tbl = this.generateExample(task);

    if (isModuleInstalled('prettier')) {
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

  private async formatTable(task: TaskDefinition) {
    let tbl = await this.generateTable(task);

    if (isModuleInstalled('prettier')) {
      const prettier = require('prettier');
      tbl = prettier.format(tbl, { parser: 'markdown' });
    }
    return tbl;
  }

  private async generateTable(task: TaskDefinition) {
    const config = await this._service.getReadMeConfig();
    const table: Table = {
      headers: {
        name: 'Option',
        defaultValue: 'Default Value',
        required: 'Required',
        helpMarkDown: 'Help'
      },
      rows: task.inputs
    };

    console.log(config);
    const rows: string[] = [];
    const headers = Object.keys(table.headers);
    const wrap = (s: string) => `|${s}|`;
    const getBool = (s: any) => s as boolean;
    const align = (a: 'left' | 'center' | 'right') => {
      switch (a) {
        case 'left':
          return ':---';
        case 'center':
          return ':---:';
        case 'right':
          return '---:';
      }
    };
    rows.push(wrap(headers.map((h) => table.headers[h]).join('|')));

    rows.push(
      wrap(
        headers
          .map((h) =>
            align(
              config?.includeOptionsFields?.find((x) => x.field === h)?.align ||
                'left'
            )
          )
          .join('|')
      )
    );

    const rws = table.rows.map((row) => {
      const b: any[] = [];
      headers.map((rowKey: any) => {
        const key = rowKey as keyof TaskInputDefinition;
        const val = row[key];
        let inVal = '--';
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

        b.push(inVal);
      });
      return wrap(b.join('|'));
    });
    rows.push(rws.join(EOL));

    return rows.join(EOL);
  }
}
