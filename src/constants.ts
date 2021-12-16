import chalk from 'chalk';
import { Section } from 'command-line-usage';
import { LIB_VERSION } from './version';

export const cliHeader = ` █████╗ ███████╗███████╗██╗  ██╗████████╗
██╔══██╗╚══███╔╝██╔════╝╚██╗██╔╝╚══██╔══╝
███████║  ███╔╝ █████╗   ╚███╔╝    ██║   
██╔══██║ ███╔╝  ██╔══╝   ██╔██╗    ██║   
██║  ██║███████╗███████╗██╔╝ ██╗   ██║   
╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝`;

export const helpCommand = { name: 'help', summary: 'Print this usage guide.' };

export const introSections: Section[] = [
  {
    content: chalk.cyanBright(cliHeader),
    raw: true
  },
  {
    content: `Version: ${chalk.redBright(LIB_VERSION)}`
  },
  {
    header: 'Azure DevOps Extension Tools',
    content: chalk.greenBright(
      'A collection of tool commands to assist in developing and maintaining extensions for Azure DevOps'
    )
  }
];

export interface ActionResult {
  isSuccess: boolean;
  message?: string;
}

export interface ActionResultWithData<T> extends ActionResult {
  data?: T;
}
