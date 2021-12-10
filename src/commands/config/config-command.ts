import commandLineArgs from 'command-line-args';
import ChangelogConfig from '../changelog/models/changelog-config';
import ICommand from '../i-command';

const defaultConfig: ChangelogConfig = {
  repository: 'joachimdalen/AzureDevOpsExtensions',
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
    feature: '🚀 Features',
    fix: '🐛 Fixes',
    tests: '🧪 Tests',
    other: '💬 Other',
    docs: 'Documentation'
  },
  attributionTitleFormat: {
    size: 'h2',
    format: '🌟 Contributors'
  },
  attributionSubTitle: {
    format: 'Thank you to the following for contributing to the latest release'
  },
  knownAuthors: [],
  useDescriptiveIssues: true
};

class ConfigCommand implements ICommand {
  parse(args: string[]) {
    const configDefinitions = [{ name: 'configCommand', defaultOption: true }];
    const configOptions = commandLineArgs(configDefinitions, {
      argv: args
    });

    console.log('configOptions\n============');
    console.log(configOptions);

    const argv = configOptions._unknown || [];

    if (configOptions.configCommand) {
      console.log('Generate default configs');
    }
  }
}

export default ConfigCommand;
