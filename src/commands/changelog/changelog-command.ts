import commandLineArgs from 'command-line-args';
import commandLineUsage, { Section } from 'command-line-usage';
import {
  helpCommand,
  helpOption,
  helpOptionUsage,
  introSections,
  IOptionWithHelp
} from '../../constants';
import ICommand from '../i-command';
import GenerateChangelogCommand from './sub-commands/generate-changelog-command';
import GenerateChangelogConfigCommand from './sub-commands/generate-changelog-config-command';

const sections: Section[] = [
  ...introSections,
  {
    header: 'Command List',
    content: [
      { name: 'generate', summary: 'Generate changelog markdown file' },
      { name: 'config', summary: 'Generate default config file' },
      helpCommand
    ]
  },
  {
    header: 'Options',
    optionList: [helpOptionUsage]
  }
];

type Options = IOptionWithHelp & {
  changelogcommand: 'help' | 'generate' | 'config';
};

class ChangelogCommand implements ICommand {
  parse(args: string[]) {
    const changelogDefinitions = [
      { name: 'changelogcommand', defaultOption: true },
      helpOption
    ];
    const changelogOptions: Options = commandLineArgs(changelogDefinitions, {
      argv: args
    }) as Options;

    console.log('changelogOptions\n============');
    console.log(changelogOptions);
    const argv = changelogOptions._unknown || [];

    switch (changelogOptions.changelogcommand) {
      case 'help': {
        const usage = commandLineUsage(sections);
        console.log(usage);
        break;
      }
      case 'config': {
        new GenerateChangelogConfigCommand().parse(argv);
        break;
      }
      case 'generate': {
        new GenerateChangelogCommand().parse(argv);
        break;
      }
    }
  }
}

export default ChangelogCommand;
