import commandLineArgs, { OptionDefinition } from 'command-line-args';
import commandLineUsage, { Section } from 'command-line-usage';
import ChangelogCommand from './commands/changelog/changelog-command';
import { CommandContext, GlobalOptions } from './commands/command-context';
import InitCommand from './commands/init/init-command';
import {
  helpCommand,
  helpOption,
  helpOptionUsage,
  introSections,
  IOptionWithHelp
} from './constants';

type Options = IOptionWithHelp & GlobalOptions;

const mainDefinitions: OptionDefinition[] = [
  { name: 'command', defaultOption: true },
  helpOption,
  { name: 'ci' }
];
const mainOptions: Options = commandLineArgs(mainDefinitions, {
  stopAtFirstUnknown: true
}) as Options;

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
    optionList: [
      helpOptionUsage,
      {
        name: 'ci',
        description:
          'Run in CI mode. Currenctly supported: ado (Azure DevOps) --ci=ado'
      }
    ]
  }
];
const argv = mainOptions._unknown || [];
const context: CommandContext = {
  globalOptions: {
    ci: mainOptions.ci
  }
};

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
    new InitCommand().process(argv, context);
    break;
  }
  case 'changelog': {
    new ChangelogCommand().process(argv, context);
    break;
  }
}
