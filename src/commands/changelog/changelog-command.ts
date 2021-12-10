import commandLineArgs from 'command-line-args';
import GenerateChangelogCommand from './commands/generate-changelog-command';

export interface ICommand {
  parse: (argv: string[]) => void;
}

class ChangelogCommand implements ICommand {
  parse(args: string[]) {
    const changelogDefinitions = [{ name: 'changelogcommand', defaultOption: true }];
    const changelogOptions = commandLineArgs(changelogDefinitions, {
      argv: args
    });

    console.log('changelogOptions\n============');
    console.log(changelogOptions);

    const argv = changelogOptions._unknown || [];

    if (changelogOptions.changelogcommand) {
      new GenerateChangelogCommand().parse(argv);
    }
  }
}

export default ChangelogCommand;
