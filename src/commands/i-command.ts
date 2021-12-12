import { CommandContext } from './command-context';

export default interface ICommand {
  process: (argv: string[], context: CommandContext) => void;
}
