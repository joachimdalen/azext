import chalk from 'chalk';
import { CommandLineOptions, OptionDefinition } from 'command-line-args';
import { Section } from 'command-line-usage';

export const cliHeader = ` █████╗ ███████╗███████╗██╗  ██╗████████╗
██╔══██╗╚══███╔╝██╔════╝╚██╗██╔╝╚══██╔══╝
███████║  ███╔╝ █████╗   ╚███╔╝    ██║   
██╔══██║ ███╔╝  ██╔══╝   ██╔██╗    ██║   
██║  ██║███████╗███████╗██╔╝ ██╗   ██║   
╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝`;

export const helpCommand = { name: 'help', summary: 'Print this usage guide.' };

export const helpOption: OptionDefinition = { name: 'help', type: Boolean };

export const introSections: Section[] = [
  {
    content: chalk.cyanBright(cliHeader),
    raw: true
  },
  {
    content: `Version: ${chalk.redBright(require('../package.json').version)}`
  },
  {
    header: 'Azure DevOps Extension Tools',
    content: chalk.greenBright(
      'A collection of tool commands to assist in developing and maintaining extensions for Azure DevOps'
    )
  }
];

export interface IOptionWithHelp extends CommandLineOptions {
  help: boolean;
}
