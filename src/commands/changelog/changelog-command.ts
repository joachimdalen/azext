import commandLineArgs, { OptionDefinition } from 'command-line-args';
import commandLineUsage, { Section } from 'command-line-usage';
import {
  helpCommand,
  helpOption,
  helpOptionUsage,
  introSections,
  IOptionWithHelp
} from '../../constants';
import { CommandContext } from '../command-context';
import ICommand from '../i-command';
import GenerateChangelogCommand from './sub-commands/generate-changelog-command';
import GenerateChangelogConfigCommand from './sub-commands/generate-changelog-config-command';
import NewChangelogCommand from './sub-commands/new-changelog-command';

const sections: Section[] = [
  ...introSections,
  {
    header: 'Command List',
    content: [
      { name: 'generate', summary: 'Generate changelog markdown file' },
      { name: 'config', summary: 'Generate default config file' },
      { name: 'new', summary: 'Generate default changelog' },
      helpCommand
    ]
  },
  {
    header: 'Options',
    optionList: [helpOptionUsage]
  }
];

type Options = IOptionWithHelp & {
  changelogcommand: 'help' | 'generate' | 'config' | 'new';
};

class ChangelogCommand implements ICommand {
  process(args: string[], context: CommandContext) {
    const changelogDefinitions: OptionDefinition[] = [
      { name: 'changelogcommand', defaultOption: true },
      helpOption
    ];
    const changelogOptions: Options = commandLineArgs(changelogDefinitions, {
      argv: args,
      stopAtFirstUnknown: true
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
      case 'new': {
        new NewChangelogCommand().process(argv, context);
        break;
      }
      case 'config': {
        new GenerateChangelogConfigCommand().process(argv, context);
        break;
      }
      case 'generate': {
        new GenerateChangelogCommand().process(argv, context);
        break;
      }
    }
  }
}

export default ChangelogCommand;
