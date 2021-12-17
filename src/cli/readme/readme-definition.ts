import chalk from 'chalk';
import { introSections, helpCommand } from '../../constants';
import { defaultHelpCommand } from '../cli-constants';
import { CommandBase } from '../models';
import ReadmeCmdHandler from './handlers/readme-cmd-handler';

const readmeCommands: CommandBase = {
  command: 'readme',
  sections: [
    ...introSections,
    {
      header: 'Command List',
      content: [{ name: 'task', summary: 'Task' }, helpCommand]
    },
    {
      header: 'Task',
      content: chalk.magentaBright('Task')
    }
  ],
  options: [],
  subCommands: [
    {
      command: 'task',
      handler: () => new ReadmeCmdHandler(),
      sections: [],
      options: [],
      subCommands: [defaultHelpCommand]
    },
    defaultHelpCommand
  ]
};

export default readmeCommands;
