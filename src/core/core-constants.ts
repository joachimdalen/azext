import TaskInputFormatter from './formatters/task-input-formatter';
import { ReplacementCommand } from './models/replacement-command';

export const replacementCommands: ReplacementCommand[] = [
  {
    command: 'task-input',
    formatter: () => new TaskInputFormatter(),
    options: [{ name: 'task' }, { name: 'type' }]
  }
];
