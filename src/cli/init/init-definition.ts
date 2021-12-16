import chalk from 'chalk';
import { introSections, helpCommand } from '../../constants';
import HelpCmdHandler from '../help-cmd-handler';
import { CommandBase } from '../models';
import InitCmdHandler from './handlers/init-cmd-handler';

const initCommands: CommandBase = {
  command: 'init',
  handler: () => new InitCmdHandler(),
  sections: [
    ...introSections,
    {
      header: 'Command List',
      content: [helpCommand]
    },
    {
      header: 'Init',
      content: chalk.magentaBright('Generate default config folder')
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'root',
          description: 'Root folder to initialize in'
        }
      ]
    }
  ],
  options: [{ name: 'root', alias: 'r', defaultValue: process.cwd() }],
  subCommands: [
    {
      command: 'help',
      handler: (options?: CommandBase) => new HelpCmdHandler(options),
      sections: [],
      options: []
    }
  ]
};

export default initCommands;
