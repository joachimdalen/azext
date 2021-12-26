import chalk from 'chalk';

import { helpCommand, introSections } from '../../constants';
import { defaultHelpCommand } from '../cli-constants';
import { CommandBase } from '../models';
import ReadmeCmdHandler from './handlers/readme-cmd-handler';
import ReadmeInitCmdHandler from './handlers/readme-init-cmd-handler';

enum ReadmeOptionNames {
  Input = 'input',
  Output = 'output'
}

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
          name: 'generate',
          summary: 'Generate readme from partial files'
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
      command: 'generate',
      handler: () => new ReadmeCmdHandler(),
      sections: [
        ...introSections,
        {
          header: 'Generate',
          content: chalk.magentaBright('Generate readme from partial files')
        },
        {
          header: 'Command List',
          content: [helpCommand]
        },
        {
          header: 'Options',
          optionList: [
            {
              name: ReadmeOptionNames.Input,
              description: 'Input file containing the template'
            },
            {
              name: ReadmeOptionNames.Output,
              description: 'Output file to write replaced value to'
            }
          ]
        }
      ],
      options: [
        { name: ReadmeOptionNames.Input, alias: 'i' },
        { name: ReadmeOptionNames.Output, alias: 'o' }
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
