import chalk from 'chalk';
import { introSections, helpCommand } from '../../constants';
import HelpCmdHandler from '../help-cmd-handler';
import { CommandBase } from '../models';
import ChangelogGenerateCmdHandler from './handlers/changelog-generate-cmd-handler';

const changelogCommands: CommandBase = {
  command: 'changelog',
  sections: [
    ...introSections,
    {
      header: 'Changelog',
      content: chalk.magentaBright('Tools to manage and generate changelogs')
    },
    {
      header: 'Command List',
      content: [
        { name: 'generate', summary: 'Generate changelog markdown file' },
        { name: 'config', summary: 'Generate default config file' },
        { name: 'new', summary: 'Generate default changelog' },
        helpCommand
      ]
    },
    {
      header: 'Options',
      optionList: []
    }
  ],
  options: [],
  subCommands: [
    {
      handler: () => new ChangelogGenerateCmdHandler(),
      command: 'generate',
      sections: [
        ...introSections,
        {
          header: 'Generate',
          content: chalk.magentaBright('Generate changelog markdown file')
        },
        {
          header: 'Command List',
          content: [helpCommand]
        },
        {
          header: 'Options',
          optionList: [
            {
              name: 'output',
              alias: 'o',
              description: 'Path to output generated markdown file to',
              defaultValue: 'CHANGELOG.md'
            },
            {
              name: 'config',
              alias: 'c',
              description: 'Path to changelog-config.json'
            },
            {
              name: 'log',
              alias: 'l',
              description: 'Path to changelog.json file'
            },
            {
              name: 'format',
              type: Boolean,
              defaultValue: true,
              description:
                'Format generated file. Requires Prettier to be installed'
            },
            {
              name: 'generate-cache',
              type: Boolean,
              defaultValue: true,
              description:
                'Generate changelog-cache.json containing a cache of issues and pull requests'
            },
            {
              name: 'from-cache',
              type: Boolean,
              defaultValue: true,
              description:
                'Use changelog-cache.json for cache during generation'
            },
            {
              name: 'cache-output'
            },
            {
              name: 'cache-file'
            },
            {
              name: 'version',
              type: String,
              description:
                'Generate changelog for only this version. Maps to the version field of changelog.json'
            }
          ]
        }
      ],
      options: [
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
          name: 'format',
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
      ],
      subCommands: [
        {
          command: 'help',
          handler: (options?: CommandBase) => new HelpCmdHandler(options),
          sections: [],
          options: []
        }
      ]
    },
    {
      command: 'config',
      sections: [
        ...introSections,
        {
          header: 'Config',
          content: chalk.magentaBright('Generate default config file')
        },
        {
          header: 'Command List',
          content: [helpCommand]
        },
        {
          header: 'Options',
          optionList: [
            {
              name: 'force',
              description: 'Overwrite file if it exists',
              defaultValue: false,
              type: Boolean
            }
          ]
        }
      ],
      options: [
        {
          name: 'force',
          type: Boolean,
          defaultValue: false
        }
      ],
      subCommands: [
        {
          command: 'help',
          handler: (options?: CommandBase) => new HelpCmdHandler(options),
          sections: [],
          options: []
        }
      ]
    },
    {
      command: 'new',
      sections: [
        ...introSections,
        {
          header: 'Command List',
          content: [helpCommand]
        },
        {
          header: 'New',
          content: chalk.magentaBright('Generate default changelog')
        },
        {
          header: 'Options',
          optionList: [
            {
              name: 'output',
              alias: 'o',
              description: 'Output file'
            }
          ]
        }
      ],
      options: [
        {
          name: 'output',
          alias: 'o',
          defaultValue: 'changelog.json'
        }
      ],
      subCommands: [
        {
          command: 'help',
          handler: (options?: CommandBase) => new HelpCmdHandler(options),
          sections: [],
          options: []
        }
      ]
    }
  ]
};

export default changelogCommands;
