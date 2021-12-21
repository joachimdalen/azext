import ReplacementCommandFormatter from './replacement-command-formatter';
import { ReplacementCommandOption } from './replacement-command-option';

export interface ReplacementCommand {
  command: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatter: () => ReplacementCommandFormatter<any>;
  options: ReplacementCommandOption[];
}
