import commandLineArgs from 'command-line-args';
import ChangelogCommand from './commands/changelog/changelog-command';

/* first - parse the main command */
const mainDefinitions = [{ name: 'command', defaultOption: true }];
const mainOptions = commandLineArgs(mainDefinitions, {
  stopAtFirstUnknown: true
});
const argv = mainOptions._unknown || [];

console.log('mainOptions\n===========');
console.log(mainOptions);

/* second - parse the merge command options */
if (mainOptions.command === 'changelog') {
  new ChangelogCommand().parse(argv);
}
