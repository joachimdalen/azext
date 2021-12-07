import { OptionDefinition } from 'command-line-args'

export interface CliOptions {
  output: string
  config: string
  log: string
  noFormat: boolean
  generateCache: boolean
  fromCache: boolean
  cacheOutput: string
  cacheFile: string
}

const options: OptionDefinition[] = [
  {
    name: 'output',
    alias: 'o',
    defaultValue: 'CHANGELOG.md',
  },
  {
    name: 'config',
    alias: 'c',
    defaultValue: 'changelog-config.json',
  },
  {
    name: 'log',
    alias: 'l',
    defaultValue: 'changelog.json',
  },
  {
    name: 'no-format',
    type: Boolean,
    defaultValue: false,
  },
  {
    name: 'generate-cache',
    type: Boolean,
    defaultValue: true,
  },
  {
    name: 'from-cache',
    type: Boolean,
    defaultValue: true,
  },
  {
    name: 'cache-output',
    defaultValue: 'changelog-cache.json',
  },
  {
    name: 'cache-file',
    defaultValue: 'changelog-cache.json',
  },
]

export default options
