import { EOL } from 'os';

import Replacer from '../../../core/replacer';
import { TaskDefinition } from '../models';
import ReplacementCommandFormatter, {
  ReplacementOptions
} from '../models/replacement-command-formatter';
import { Table } from '../models/table';
import { TableHeader } from '../models/table-header';
import TaskService from '../task-service';

export interface TaskFieldFormatterOptions {
  task: string;
  objectHandle?: 'json' | 'json-pretty';
  codeFormat?: string;
  field: keyof TaskDefinition;
}

export default class TaskFieldFormatter extends ReplacementCommandFormatter<TaskFieldFormatterOptions> {
  private _service: TaskService;
  private _replacer: Replacer;
  constructor() {
    super();
    this._service = new TaskService();
    this._replacer = new Replacer();
  }
  async getFormatted(
    options: ReplacementOptions<TaskFieldFormatterOptions>
  ): Promise<any> {
    const task = await this._service.getTaskDefinition(options.task);

    if (task === undefined) return '';

    if (options.field === 'version') {
      return `${task.version.Major}.${task.version.Minor}.${task.version.Patch}`;
    }

    if (options.field === 'outputVariables') {
      const table = this.getOutputVariablesTable(task);
      if (table === undefined) return '';
      return this._formatterService.formatTable(table);
    }

    const field = task[options.field];

    if (field === undefined) {
      throw new Error(`Failed to find a value for field ${options.field}`);
    }

    if (typeof field === 'object' && options.objectHandle !== undefined) {
      if (options.objectHandle === 'json') {
        return this.wrapCode(options, JSON.stringify(field));
      } else if (options.objectHandle === 'json-pretty') {
        return this.wrapCode(options, JSON.stringify(field, null, 2));
      }
    }

    if (typeof field === 'object' && options.objectHandle === undefined) {
      throw new Error(`${options.field} is object, do not know how to handle`);
    }

    return field;
  }

  wrapCode(options: TaskFieldFormatterOptions, value: any) {
    if (options.codeFormat) {
      return '```' + options.codeFormat + EOL + value + EOL + '```';
    }
    return value;
  }

  private getOutputVariablesTable(task: TaskDefinition): Table | undefined {
    const headers: TableHeader[] = [
      { title: 'Name', align: 'left' },
      { title: 'Description', align: 'left' }
    ];

    const rows = task.outputVariables?.map((x) => [x.name, x.description]);

    if (rows === undefined) return undefined;

    return {
      header: headers,
      rows: rows
    };
  }
}
