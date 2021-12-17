import { EOL } from 'os';

import { TaskDefinition } from '../../modules/readme/models';
import TaskService from '../../modules/readme/task-service';
import ReplacementCommandFormatter from '../models/replacement-command-formatter';
import Replacer from '../replacer';

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
  async getFormatted(options: TaskFieldFormatterOptions): Promise<any> {
    const task = await this._service.getTaskDefinition(options.task);

    if (task === undefined) return '';

    if (options.field === 'version') {
      return `${task.version.Major}.${task.version.Minor}.${task.version.Patch}`;
    }

    const field = task[options.field];

    if (field !== undefined && typeof field === 'object') {
      if (options.objectHandle?.startsWith('json')) {
        return this.wrapCode(
          options,
          options.objectHandle === 'json-pretty'
            ? JSON.stringify(field, null, 2)
            : JSON.stringify(field)
        );
      } else {
        throw new Error(
          `${options.field} is object, do not know how to handle`
        );
      }
    }
  }

  wrapCode(options: TaskFieldFormatterOptions, value: any) {
    if (options.codeFormat) {
      return '```' + options.codeFormat + EOL + value + EOL + '```';
    }
    return value;
  }
}
