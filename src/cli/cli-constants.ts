import HelpCmdHandler from './help-cmd-handler';
import { CommandBase } from './models';

export const defaultHelpCommand: CommandBase = {
  command: 'help',
  handler: (options?: CommandBase) => new HelpCmdHandler(options),
  sections: [],
  options: []
};
