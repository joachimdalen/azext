import TaskUsageFormatter from './formatters/task-usage-formatter';
import { ReplacementCommand } from './models/replacement-command';

export const replacementCommands: ReplacementCommand[] = [
  {
    command: 'task-usage',
    formatter: () => new TaskUsageFormatter(),
    options: [{ name: 'task' }, { name: 'type' }]
  }
];
