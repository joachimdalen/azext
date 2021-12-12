import chalk from 'chalk';
import commandLineArgs, { OptionDefinition } from 'command-line-args';
import ConfigProvider from '../../../data-providers/config-provider';
import { CommandContext } from '../../command-context';
import ICommand from '../../i-command';
import ChangelogConfig from '../models/changelog-config';

const defaultConfig: ChangelogConfig = {
  repository: '',
  changelogTitle: {
    size: 'h1',
    format: 'Changelog'
  },
  releaseTitleFormat: {
    size: 'h2',
    format: '{{version}} ({{publishDate}})'
  },
  moduleTitleFormat: {
    size: 'h4',
    format: '`{{name}}@{{version}}`'
  },
  taskMapping: {},
  sectionSplitter: '---',
  tagSize: 'h3',
  tagMapping: {
    feature: ':rocket: Features',
    fix: ':bug: Fixes',
    tests: ':test_tube: Tests',
    other: ':speech_balloon: Other',
    docs: ':memo: Documentation'
  },
  attributionTitleFormat: {
    size: 'h2',
    format: ':star2: Contributors'
  },
  attributionSubTitle: {
    format: 'Thank you to the following for contributing to the latest release'
  },
  knownAuthors: [],
  useDescriptiveIssues: true,
  replaceEmojis: {
    tags: true,
    changelogTitle: true,
    releaseTitle: true,
    moduleTitle: true,
    attributionTitle: true,
    attributionSubTitle: true,
    githubIssues: false,
    githubPullRequests: false,
    notes: true,
    summary: true
  }
};

const options: OptionDefinition[] = [
  {
    name: 'force',
    type: Boolean,
    defaultValue: false
  }
];

interface GenerateChangelogConfigCommandOptions {
  outputDir: string;
  force: boolean;
}

class GenerateChangelogConfigCommand implements ICommand {
  private readonly _changelogConfigName = 'changelog-config.json';
  private readonly _configProvider: ConfigProvider;
  constructor() {
    this._configProvider = new ConfigProvider();
  }

  async process(argv: string[], context: CommandContext) {
    const cliOpts: GenerateChangelogConfigCommandOptions = commandLineArgs(
      options,
      {
        argv,
        camelCase: true
      }
    ) as GenerateChangelogConfigCommandOptions;

    const exists = await this._configProvider.getConfig<ChangelogConfig>(
      this._changelogConfigName
    );

    if (exists !== undefined && !cliOpts.force) {
      console.log(
        chalk.redBright('Config file already exists, use --force to overwrite')
      );
      return;
    }

    await this._configProvider.writeConfig(
      this._changelogConfigName,
      defaultConfig
    );
  }
}
export default GenerateChangelogConfigCommand;
