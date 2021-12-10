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

class ChangelogCommand implements ICommand {
  parse(args: string[]) {
    const changelogDefinitions = [
      { name: 'changelogcommand', defaultOption: true },
      helpOption
    ];
    const changelogOptions: IOptionWithHelp = commandLineArgs(
      changelogDefinitions,
      {
        argv: args
      }
    ) as IOptionWithHelp;

    console.log('changelogOptions\n============');
    console.log(changelogOptions);
    const argv = changelogOptions._unknown || [];

    switch (changelogOptions.changelogcommand) {
      case 'help': {
        const usage = commandLineUsage(sections);
        console.log(usage);
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
