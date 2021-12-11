import chalk from 'chalk';
import commandLineArgs, { OptionDefinition } from 'command-line-args';
import commandLineUsage, { Section } from 'command-line-usage';
import { helpCommand, introSections, IOptionWithHelp } from '../../constants';
import ConfigProvider from '../../data-providers/config-provider';
import ICommand from '../i-command';

const sections: Section[] = [
  ...introSections,
  {
    header: 'Command List',
    content: [helpCommand]
  },
  {
    header: 'Init',
    content: chalk.magentaBright('Generate default config folder')
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'root',
        description: 'Root folder to initialize in'
      }
    ]
  }
];

class InitCommand implements ICommand {
  private _configProvider: ConfigProvider;
  constructor() {
    this._configProvider = new ConfigProvider();
  }
  parse(args: string[]) {
    const initDefinitions: OptionDefinition[] = [
      { name: 'initcommand', defaultOption: true },
      { name: 'root', alias: 'r', defaultValue: process.cwd() }
    ];
    const initOptions: IOptionWithHelp = commandLineArgs(initDefinitions, {
      argv: args
    }) as IOptionWithHelp;

    console.log('initOptions\n============');
    console.log(initOptions);
    const argv = initOptions._unknown || [];

    if (initOptions.initcommand === 'help') {
      const usage = commandLineUsage(sections);
      console.log(usage);
    } else {
      this._configProvider.createConfigFolderIfNotExists();
    }
  }
}

export default InitCommand;
