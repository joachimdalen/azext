import chalk from 'chalk';
import commandLineArgs, { OptionDefinition } from 'command-line-args';
import commandLineUsage, { Section } from 'command-line-usage';
import {
  helpCommand,
  introSections,
  IOptionWithHelp
} from '../../../constants';
import { logWarning, setVariable } from '../../../core/azure-devops-logger';
import { CommandContext } from '../../command-context';
import ICommand from '../../i-command';
import { ADO_LATEST_VERSION, ADO_OUTPUT_PATH } from '../changelog-constants';
import Generator from '../generator';

const options: OptionDefinition[] = [
  { name: 'command', defaultOption: true },
  {
    name: 'output',
    alias: 'o',
    defaultValue: 'CHANGELOG.md'
  },
  {
    name: 'config',
    alias: 'c'
  },
  {
    name: 'log',
    alias: 'l'
  },
  {
    name: 'format',
    type: Boolean,
    defaultValue: false
  },
  {
    name: 'generate-cache',
    type: Boolean,
    defaultValue: true
  },
  {
    name: 'from-cache',
    type: Boolean,
    defaultValue: true
  },
  {
    name: 'cache-output'
  },
  {
    name: 'cache-file'
  },
  {
    name: 'version'
  }
];

const sections: Section[] = [
  ...introSections,
  {
    header: 'Generate',
    content: chalk.magentaBright('Generate changelog markdown file')
  },
  {
    header: 'Command List',
    content: [helpCommand]
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'output',
        alias: 'o',
        description: 'Path to output generated markdown file to',
        defaultValue: 'CHANGELOG.md'
      },
      {
        name: 'config',
        alias: 'c',
        description: 'Path to changelog-config.json'
      },
      {
        name: 'log',
        alias: 'l',
        description: 'Path to changelog.json file'
      },
      {
        name: 'format',
        type: Boolean,
        defaultValue: true,
        description: 'Format generated file. Requires Prettier to be installed'
      },
      {
        name: 'generate-cache',
        type: Boolean,
        defaultValue: true,
        description:
          'Generate changelog-cache.json containing a cache of issues and pull requests'
      },
      {
        name: 'from-cache',
        type: Boolean,
        defaultValue: true,
        description: 'Use changelog-cache.json for cache during generation'
      },
      {
        name: 'cache-output'
      },
      {
        name: 'cache-file'
      },
      {
        name: 'version',
        type: String,
        description:
          'Generate changelog for only this version. Maps to the version field of changelog.json'
      }
    ]
  }
];

export interface GenerateChangelogCommandOptions extends IOptionWithHelp {
  output: string;
  config: string;
  log: string;
  format: boolean;
  generateCache: boolean;
  fromCache: boolean;
  cacheOutput: string;
  cacheFile: string;
  version?: string;
  command?: string;
}

class GenerateChangelogCommand implements ICommand {
  process(argv: string[], context: CommandContext) {
    const parsedOptions: GenerateChangelogCommandOptions = commandLineArgs(
      options,
      {
        argv,
        camelCase: true,
        stopAtFirstUnknown: true
      }
    ) as GenerateChangelogCommandOptions;

    if (parsedOptions.command === 'help') {
      const usage = commandLineUsage(sections);
      console.log(usage);
    } else {
      new Generator()
        .generateChangelog(parsedOptions)
        .then((changelogResult) => {
          if (context.globalOptions.ci === 'ado') {
            if (changelogResult === undefined) {
              logWarning('Failed to generate changelog');
            } else {
              setVariable(ADO_LATEST_VERSION, changelogResult.latestVersion);
              setVariable(ADO_OUTPUT_PATH, changelogResult.outputPath);
            }
          }
        });
    }
  }
}
export default GenerateChangelogCommand;
