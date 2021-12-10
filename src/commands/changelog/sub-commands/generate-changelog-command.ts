import commandLineArgs from 'command-line-args';
import ICommand from '../../i-command';
import options, { CliOptions } from '../cli-args';
import Generator from '../generator';

class GenerateChangelogCommand implements ICommand {
  parse(argv: string[]) {
    const cliOpts: CliOptions = commandLineArgs(options, {
      argv,
      camelCase: true
    }) as CliOptions;

    new Generator().generateChangelog(cliOpts).then(() => console.log('ok'));
  }
}
export default GenerateChangelogCommand;
