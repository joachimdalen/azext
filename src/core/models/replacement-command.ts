import ReplacementCommandFormatter from './replacement-command-formatter';
import { ReplacementCommandOption } from './replacement-command-option';

export interface ReplacementCommand {
  command: string;
  formatter: () => ReplacementCommandFormatter<any>;
  options: ReplacementCommandOption[];
}
