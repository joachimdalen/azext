import chalk from 'chalk';
import commandLineArgs, { OptionDefinition } from 'command-line-args';
import commandLineUsage, { Section } from 'command-line-usage';
import {
  introSections,
  helpCommand,
  IOptionWithHelp
} from '../../../constants';
import ConfigProvider from '../../../data-providers/config-provider';
import { CommandContext } from '../../command-context';
import ICommand from '../../i-command';
import ChangelogConfig from '../models/changelog-config';
import ChangelogDefinition from '../models/changelog-definition';

const defaultChangelog: ChangelogDefinition = {
  publishDate: '01-01-1970',
  version: '0.0.0',
  notes: 'Optional notes',
  summary: 'Optional summary',
  modules: [
    {
      name: 'module-name',
      version: '0.0.0',
      changes: [
        {
          description: 'Some change description',
          type: 'feature',
          issue: 0,
          pullRequest: 0
        }
      ]
    }
  ]
};

const options: OptionDefinition[] = [
  {
    name: 'output',
    alias: 'o',
    defaultValue: 'changelog.json'
  }
];

const sections: Section[] = [
  ...introSections,
  {
    header: 'Command List',
    content: [helpCommand]
  },
  {
    header: 'New',
    content: chalk.magentaBright('Generate default changelog')
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'output',
        alias: 'o',
        description: 'Output file'
      }
    ]
  }
];

interface NewChangelogCommandOptions extends IOptionWithHelp {
  output: string;
}

class NewChangelogCommand implements ICommand {
  private readonly _configProvider: ConfigProvider;
  constructor() {
    this._configProvider = new ConfigProvider();
  }

  async process(args: string[], context: CommandContext) {
    const newDefinitions: OptionDefinition[] = [
      { name: 'newcommand', defaultOption: true },
      ...options
    ];
    const newOptions: NewChangelogCommandOptions = commandLineArgs(
      newDefinitions,
      {
        argv: args
      }
    ) as NewChangelogCommandOptions;

    if (newOptions.newcommand === 'help') {
      const usage = commandLineUsage(sections);
      console.log(usage);
    } else {
      const exists = await this._configProvider.getConfig<ChangelogConfig>(
        newOptions.output
      );

      if (exists !== undefined) {
        console.log(chalk.redBright('Changelog file already exists'));
        return;
      }

      await this._configProvider.writeConfig(newOptions.output, [
        defaultChangelog
      ]);
    }
  }
}
export default NewChangelogCommand;
