import commandLineArgs from 'command-line-args';
import ChangelogCommand from './commands/changelog/changelog-command';
import GenerateChangelogCommand from './commands/changelog/sub-commands/generate-changelog-command';
import ICommand from './commands/i-command';

const mainDefinitions = [{ name: 'command', defaultOption: true }];
const mainOptions = commandLineArgs(mainDefinitions, {
  stopAtFirstUnknown: true
});
const argv = mainOptions._unknown || [];

console.log('mainOptions\n===========');
console.log(mainOptions);

if (mainOptions.command === 'changelog') {
  new ChangelogCommand().parse(argv);
}

interface RootCommandMapping {
  [key: string]: CommandMapping;
}

interface CommandMapping {
  base: ICommand;
  subCommands?: {
    [key: string]: CommandMapping;
  };
}
const commandMapping: RootCommandMapping = {
  changelog: {
    base: new ChangelogCommand(),
    subCommands: {
      generate: {
        base: new GenerateChangelogCommand()
      }
    }
  }
};
