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
      sections: [
        ...introSections,
        {
          header: 'Task',
          content: chalk.magentaBright('')
        },
        {
          header: 'Command List',
          content: [helpCommand]
        },
        {
          header: 'Options',
          optionList: [
            {
              name: 'input',
              description: 'Input file containing the template'
            },
            {
              name: 'output',
              description: 'Output file to write replaced value to'
            }
          ]
        }
      ],
      options: [
        { name: 'input', alias: 'i' },
        { name: 'output', alias: 'o' }
      ],
      subCommands: [defaultHelpCommand]
    },
    defaultHelpCommand
  ]
};

export default readmeCommands;
