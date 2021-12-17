import ReplacementCommandFormatter from '../models/replacement-command-formatter';
import { EOL } from 'os';
import { isModuleInstalled } from '..';
import TaskService from '../../modules/readme/task-service';
import { TaskInputDefinition } from '../../modules/readme/models';

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

    return this.formatTable({
      headers: {
        label: 'Label',
        defaultValue: 'Default Value',
        required: 'Required'
      },
      rows: task.inputs
    });
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
