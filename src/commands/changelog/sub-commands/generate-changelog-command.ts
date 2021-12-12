import commandLineArgs from 'command-line-args';
import { logWarning, setVariable } from '../../../core/azure-devops-logger';
import { CommandContext } from '../../command-context';
import ICommand from '../../i-command';
import { ADO_LATEST_VERSION, ADO_OUTPUT_PATH } from '../changelog-constants';
import options, { CliOptions } from '../cli-args';
import Generator from '../generator';

class GenerateChangelogCommand implements ICommand {
  process(argv: string[], context: CommandContext) {
    const cliOpts: CliOptions = commandLineArgs(options, {
      argv,
      camelCase: true
    }) as CliOptions;

    new Generator().generateChangelog(cliOpts).then((changelogResult) => {
      if (context.globalOptions.ci === 'ado') {
        if (changelogResult === undefined) {
          logWarning('Failed to generate changelog');
        } else {
          setVariable(ADO_LATEST_VERSION, changelogResult.latestVersion);
          setVariable(ADO_OUTPUT_PATH, changelogResult.outputPath);
        }
      }
    });
  }
}
export default GenerateChangelogCommand;
