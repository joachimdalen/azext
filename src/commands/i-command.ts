export default interface ICommand {
  parse: (argv: string[]) => void;
}
