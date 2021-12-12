import { OptionDefinition } from 'command-line-args';

export interface CliOptions {
  output: string;
  config: string;
  log: string;
  noFormat: boolean;
  generateCache: boolean;
  fromCache: boolean;
  cacheOutput: string;
  cacheFile: string;
  version?: string;
}

const options: OptionDefinition[] = [
  {
    name: 'output',
    alias: 'o',
    defaultValue: 'CHANGELOG.md'
  },
  {
    name: 'config',
    alias: 'c'
  },
  {
    name: 'log',
    alias: 'l'
  },
  {
    name: 'no-format',
    type: Boolean,
    defaultValue: false
  },
  {
    name: 'generate-cache',
    type: Boolean,
    defaultValue: true
  },
  {
    name: 'from-cache',
    type: Boolean,
    defaultValue: true
  },
  {
    name: 'cache-output'
  },
  {
    name: 'cache-file'
  },
  {
    name: 'version'
  }
];

export default options;
