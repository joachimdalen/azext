import commandLineArgs from 'command-line-args';
import ICommand from '../i-command';
import GenerateChangelogCommand from './sub-commands/generate-changelog-command';

class ChangelogCommand implements ICommand {
  parse(args: string[]) {
    const changelogDefinitions = [
      { name: 'changelogcommand', defaultOption: true }
    ];
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
