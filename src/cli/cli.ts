import chalk from 'chalk';
import commandLineArgs, { OptionDefinition } from 'command-line-args';
import { ActionResultWithData, helpCommand, introSections } from '../constants';
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

interface ParseResult {
  command: CommandBase;
  parent?: CommandBase;
  rest: ParsedCommand<RootCommand>;
}

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

  parse(args?: string[]): ActionResultWithData<ParseResult> {
    let parsed = this.getOptions<RootCommand>([this.commandOption], args);
    const existingCommand = this.rootCommands.find(
      (x) => x.command === parsed.options.command
    );
    console.log(JSON.stringify(parsed, null, 2));
    if (existingCommand === undefined) {
      return {
        isSuccess: false,
        message: `No such command ${parsed.options.command}`
      };
    }

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
      } else {
        return {
          isSuccess: false,
          message: `No such command ${parsed.options.command}`
        };
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
      return {
        isSuccess: false,
        message: 'Unknown sub command ' + parsed.restArgs[0]
      };
    }

    return {
      isSuccess: true,
      data: {
        command: cmd,
        parent: parentCmd,
        rest: parsed
      }
    };
  }

  async run(): Promise<void> {
    const { isSuccess, message, data } = this.parse();

    if (isSuccess && data !== undefined) {
      if (data?.command.handler === undefined) {
        throw new Error(
          'No handler defined for command ' + data.command?.command
        );
      } else {
        const handler = data.command.handler(data.parent || data.command);
        await handler.handleCommand(handler.getOptions(data.rest.options));
      }
    } else {
      console.log(chalk.redBright(message));
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
