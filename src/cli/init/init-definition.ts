import chalk from 'chalk';

import { helpCommand, introSections } from '../../constants';
import { defaultHelpCommand } from '../cli-constants';
import { CommandBase } from '../models';
import InitCmdHandler from './handlers/init-cmd-handler';
import InitMappingCmdHandler from './handlers/init-mapping-cmd-handler';

enum InitOptionNames {
  Root = 'root'
}

const initCommands: CommandBase = {
  command: 'init',
  skipDirectoryCheck: true,
  handler: () => new InitCmdHandler(),
  sections: [
    ...introSections,
    {
      header: 'Init',
      content: chalk.magentaBright('Generate default config folder')
    },
    {
      header: 'Command List',
      content: [
        { name: 'mapping', summary: 'Generate a new default mapping file' },
        helpCommand
      ]
    },
    {
      header: 'Options',
      optionList: [
        {
          name: InitOptionNames.Root,
          description: 'Root folder to initialize in'
        }
      ]
    }
  ],
  options: [{ name: 'root', alias: 'r', defaultValue: process.cwd() }],
  subCommands: [
    {
      command: 'mapping',
      handler: () => new InitMappingCmdHandler(),
      sections: [
        ...introSections,
        {
          header: 'Mapping',
          content: chalk.magentaBright('Generate a new default mapping file')
        },
        {
          header: 'Command List',
          content: [helpCommand]
        },
        {
          header: 'Options',
          optionList: [
            {
              name: InitOptionNames.Root,
              description: 'Root folder to initialize in'
            }
          ]
        }
      ],
      options: [{ name: InitOptionNames.Root, alias: 'r' }],
      subCommands: [defaultHelpCommand]
    },
    defaultHelpCommand
  ]
};

export default initCommands;
