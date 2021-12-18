import chalk from 'chalk';

import { helpCommand, introSections } from '../../constants';
import { defaultHelpCommand } from '../cli-constants';
import { CommandBase } from '../models';
import ReadmeCmdHandler from './handlers/readme-cmd-handler';
import ReadmeInitCmdHandler from './handlers/readme-init-cmd-handler';

const readmeCommands: CommandBase = {
  command: 'readme',
  sections: [
    ...introSections,
    {
      header: 'Readme',
      content: chalk.magentaBright(
        'Tools to manage and generate partial documentation'
      )
    },
    {
      header: 'Command List',
      content: [
        {
          name: 'task-usage',
          summary: 'Add task inputs to documentation files'
        },
        {
          name: 'init',
          summary: 'Create a new readme configuration file'
        },
        helpCommand
      ]
    }
  ],
  options: [],
  subCommands: [
    {
      command: 'task-usage',
      handler: () => new ReadmeCmdHandler(),
      sections: [
        ...introSections,
        {
          header: 'Task Usage',
          content: chalk.magentaBright('Add task inputs to documentation files')
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
    {
      command: 'init',
      handler: () => new ReadmeInitCmdHandler(),
      sections: [
        ...introSections,
        {
          header: 'Init',
          content: chalk.magentaBright('Create a new readme configuration file')
        },
        {
          header: 'Command List',
          content: [helpCommand]
        }
      ],
      options: [],
      subCommands: [defaultHelpCommand]
    },
    defaultHelpCommand
  ]
};

export default readmeCommands;
