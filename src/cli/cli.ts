import chalk from 'chalk';
import commandLineArgs, { OptionDefinition } from 'command-line-args';
import { helpCommand, introSections } from '../constants';
import changelogCommands from './changelog/changelog-definition';
import HelpCmdHandler from './help-cmd-handler';
import initCommands from './init/init-definition';
import { CommandBase, ParsedCommand, RootCommand } from './models';

const root: CommandBase = {
  command: 'help',
  handler: (options?: CommandBase) => new HelpCmdHandler(options),
  sections: [
    ...introSections,
    {
      header: 'Command List',
      content: [
        { name: 'init', summary: 'Generate default config folder' },
        {
          name: 'changelog',
          summary: 'Tools to manage and generate changelogs'
        },
        helpCommand
      ]
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'ci',
          description:
            'Run in CI mode. Currenctly supported: ado (Azure DevOps) --ci=ado'
        }
      ]
    }
  ],
  options: []
};

class AzExtCli {
  private readonly rootCommands: CommandBase[] = [
    root,
    changelogCommands,
    initCommands
  ];
  private readonly commandOption: OptionDefinition = {
    name: 'command',
    defaultOption: true
  };
  async run(): Promise<void> {
    let parsed = this.getOptions<RootCommand>([this.commandOption]);
    const existingCommand = this.rootCommands.find(
      (x) => x.command === parsed.options.command
    );

    if (existingCommand === undefined) {
      console.log(chalk.redBright(`No such command ${parsed.options.command}`));
      return;
    }
    console.log(chalk.green(`Found command ${existingCommand.command}`));

    let cmd: CommandBase | undefined = existingCommand;
    let parentCmd: CommandBase | undefined = undefined;
    let level = 0;

    while (this.hasSubCommands(cmd?.subCommands)) {
      if (level > 5) throw new Error('Level error');
      parsed = this.getOptions<RootCommand>(
        [this.commandOption],
        parsed.restArgs
      );
      const foundSubCommand: CommandBase | undefined = cmd?.subCommands?.find(
        (x) => x.command === parsed.options.command
      );

      if (foundSubCommand != undefined) {
        parentCmd = cmd;
        cmd = foundSubCommand;
        console.log('Found sub command ' + cmd.command);
      } else {
        console.log(
          chalk.redBright(`No such command ${parsed.options.command}`)
        );
        return;
      }
      level++;
    }

    const options = this.getOptions<any>(cmd.options, parsed.restArgs);
    console.log(options);
    if (
      parsed.restArgs &&
      parsed.restArgs.length > 0 &&
      !parsed.restArgs[0].startsWith('-')
    ) {
      console.log(
        chalk.bgRedBright.black('Unknown sub command ' + parsed.restArgs[0])
      );
      return;
    }

    if (cmd?.handler === undefined) {
      throw new Error('No handler defined for command ' + cmd?.command);
    } else {
      const handler = cmd.handler(parentCmd || cmd);
      await handler.handleCommand(handler.getOptions(options.options));
    }
  }

  hasSubCommands(commands: CommandBase[] | undefined) {
    if (commands === undefined) return false;
    if (commands.length === 0) return false;
    return true;
  }
  getOptions<T>(
    definition: OptionDefinition[],
    args?: string[]
  ): ParsedCommand<T> {
    const baseOpts = {
      camelCase: true,
      stopAtFirstUnknown: true
    };
    const parsedOptions = commandLineArgs(
      definition,
      args !== undefined
        ? {
            ...baseOpts,
            argv: args
          }
        : baseOpts
    );
    return {
      options: parsedOptions as T,
      restArgs: parsedOptions._unknown ?? []
    };
  }
}

export default AzExtCli;