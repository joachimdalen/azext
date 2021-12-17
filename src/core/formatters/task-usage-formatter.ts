import ReplacementCommandFormatter from '../models/replacement-command-formatter';
import { EOL } from 'os';
import { isModuleInstalled } from '..';
import TaskService from '../../modules/readme/task-service';
import {
  TaskDefinition,
  TaskInputDefinition
} from '../../modules/readme/models';
import path from 'path/posix';

export interface TaskUsageFormatterOptions {
  task: string;
  type: 'table' | 'example';
}

interface Table {
  headers: Record<string, string>;
  rows: TaskInputDefinition[];
}

export default class TaskUsageFormatter extends ReplacementCommandFormatter<TaskUsageFormatterOptions> {
  private _service: TaskService;
  constructor() {
    super();
    this._service = new TaskService();
  }
  async getFormatted(options: TaskUsageFormatterOptions): Promise<string> {
    const task = await this._service.getTaskDefinition(options.task);

    if (task === undefined) return '';
    if (task.inputs === undefined) return '';

    if (options.type === 'table') {
      return this.formatTable({
        headers: {
          label: 'Label',
          defaultValue: 'Default Value',
          required: 'Required'
        },
        rows: task.inputs
      });
    }
    return this.formatExample(task);
  }

  private formatExample(task: TaskDefinition) {
    let tbl = this.generateExample(task);

    if (isModuleInstalled('prettier')) {
      const prettier = require('prettier');
      tbl = prettier.format(tbl, { parser: 'yaml' });
    }
    return tbl;
  }

  private generateExample(task: TaskDefinition) {
    const parts = [];
    parts.push(
      `- task: ${task.friendlyName}@${task.version.Major}.${task.version.Minor}.${task.version.Patch}`
    );
    parts.push(`  inputs:`);
    task.inputs.forEach((ip) => {
      parts.push(`     ${ip.name}: ${ip.defaultValue}`);
    });

    return parts.join(EOL);
  }

  private formatTable(table: Table) {
    let tbl = this.generateTable(table);

    if (isModuleInstalled('prettier')) {
      const prettier = require('prettier');
      tbl = prettier.format(tbl, { parser: 'markdown' });
    }
    return tbl;
  }

  private generateTable(table: Table) {
    const rows: string[] = [];

    const headers = Object.keys(table.headers);
    const wrap = (s: string) => `|${s}|`;
    rows.push(wrap(headers.map((h) => table.headers[h]).join('|')));
    rows.push(wrap(headers.map((_) => '---').join('|')));

    const rws = table.rows.map((row, idx) => {
      const b: any[] = [];
      headers.map((rowKey: any) => {
        b.push(row[rowKey as keyof TaskInputDefinition]);
      });
      return wrap(b.join('|'));
    });
    rows.push(rws.join(EOL));

    return rows.join(EOL);
  }
}
