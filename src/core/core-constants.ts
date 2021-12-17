import TaskFieldFormatter from './formatters/task-field-formatter';
import TaskInputFormatter from './formatters/task-input-formatter';
import { ReplacementCommand } from './models/replacement-command';

export const replacementCommands: ReplacementCommand[] = [
  {
    command: 'task-input',
    formatter: () => new TaskInputFormatter(),
    options: [{ name: 'task' }, { name: 'type' }]
  },
  {
    command: 'task-field',
    formatter: () => new TaskFieldFormatter(),
    options: [
      { name: 'task' },
      { name: 'field' },
      { name: 'objectHandle', optional: true },
      { name: 'codeFormat', optional: true }
    ]
  }
];
