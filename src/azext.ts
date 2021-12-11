import commandLineArgs, { OptionDefinition } from 'command-line-args';
import commandLineUsage, { Section } from 'command-line-usage';
import ChangelogCommand from './commands/changelog/changelog-command';
import InitCommand from './commands/init/init-command';
import {
  helpCommand,
  helpOption,
  helpOptionUsage,
  introSections,
  IOptionWithHelp
} from './constants';

const mainDefinitions: OptionDefinition[] = [
  { name: 'command', defaultOption: true },
  helpOption
];
const mainOptions: IOptionWithHelp = commandLineArgs(mainDefinitions, {
  stopAtFirstUnknown: true
}) as IOptionWithHelp;

const sections: Section[] = [
  ...introSections,
  {
    header: 'Command List',
    content: [
      { name: 'init', summary: 'Generate default config folder' },
      { name: 'changelog', summary: 'Tools to manage and generate changelogs' },
      helpCommand
    ]
  },
  {
    header: 'Options',
    optionList: [helpOptionUsage]
  }
];

const argv = mainOptions._unknown || [];

console.log('mainOptions\n===========');
console.log(mainOptions);

/* if (mainOptions.help) {
  const usage = commandLineUsage(sections);
  console.log(usage);
} */

switch (mainOptions.command) {
  case 'help': {
    const usage = commandLineUsage(sections);
    console.log(usage);
    break;
  }
  case 'init': {
    new InitCommand().parse(argv);
    break;
  }
  case 'changelog': {
    new ChangelogCommand().parse(argv);
    break;
  }
}
