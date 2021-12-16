import chalk from 'chalk';
import { OptionDefinition } from 'command-line-args';
import { Section } from 'command-line-usage';
import { ActionResult } from '../constants';
import HelpCmdHandler from './help-cmd-handler';

export interface RootCommand {
  command: string;
  [key: string]: any;
}

export abstract class BaseCommandHandler<T> {
  constructor(protected readonly commandOptions?: CommandBase) {}
  getOptions(options: any) {
    console.log('Converting options');
    console.log(options);
    return options as T;
  }
  writeResult(result: ActionResult) {
    if (result.isSuccess) {
      console.log(chalk.greenBright(result.message));
    } else {
      console.log(chalk.redBright(result.message));
    }
  }
  abstract handleCommand(
    options: T,
    globalOptions?: GlobalOptions
  ): Promise<void>;
}
export interface ParsedCommand<T> {
  restArgs?: string[];
  options: T;
}

export interface CommandBase {
  command: string;
  optionType?: unknown;
  handler?: (command?: CommandBase) => BaseCommandHandler<any>;
  sections: Section[];
  options: OptionDefinition[];
  subCommands?: CommandBase[];
}

export const helpCommand: CommandBase = {
  command: 'help',
  handler: (options?: CommandBase) => new HelpCmdHandler(options),
  sections: [],
  options: []
};

export interface GlobalOptions {
  ci?: 'ado';
}
