import chalk from 'chalk';
import path from 'path';

import { helpCommand, introSections } from '../../constants';
import { workingDirectory } from '../../core/process';
import {
  CHANGELOG_CACHE_NAME,
  CHANGELOG_CONFIG_NAME,
  CHANGELOG_NAME,
  CHANGELOG_OUTPUT_NAME
} from '../../modules/changelog/changelog-constants';
import HelpCmdHandler from '../help-cmd-handler';
import { CommandBase } from '../models';
import CacheChangelogCmdHandler from './handlers/changelog-cache-cmd-handler';
import NewChangelogConfigCmdHandler from './handlers/changelog-config-cmd-handler';
import ChangelogGenerateCmdHandler from './handlers/changelog-generate-cmd-handler';
import NewChangelogCmdHandler from './handlers/changelog-new-cmd-handler';

enum ChangelogCliNames {
  ConfigName = 'config-name',
  Force = 'force',
  Output = 'output',
  Format = 'format',
  GenerateCache = 'generate-cache',
  FromCache = 'from-cache',
  CacheName = 'cache-name',
  Version = 'version',
  OutputName = 'output-name',
  Fresh = 'fresh',
  LogName = 'log-name'
}

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
        {
          name: 'cache',
          summary:
            'Refresh issue and pull request cache for changelog generation'
        },
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
              name: ChangelogCliNames.Output,
              alias: 'o',
              description: 'Full path to output generated markdown file to',
              defaultValue: path.join(workingDirectory(), CHANGELOG_OUTPUT_NAME)
            },
            {
              name: ChangelogCliNames.ConfigName,
              alias: 'c',
              description:
                'File name of configuration file. Default: ' +
                CHANGELOG_CONFIG_NAME,
              defaultValue: CHANGELOG_CONFIG_NAME
            },
            {
              name: ChangelogCliNames.LogName,
              alias: 'l',
              description:
                'File name of changelog entry file. Default: ' + CHANGELOG_NAME,
              defaultValue: CHANGELOG_NAME
            },
            {
              name: ChangelogCliNames.Format,
              type: Boolean,
              defaultValue: true,
              description:
                'Format generated file. Requires Prettier to be installed'
            },
            {
              name: ChangelogCliNames.GenerateCache,
              type: Boolean,
              defaultValue: true,
              description: `Generate ${CHANGELOG_CACHE_NAME} containing a cache of issues and pull requests`
            },
            {
              name: ChangelogCliNames.FromCache,
              type: Boolean,
              defaultValue: true,
              description: `Load issues and pull requests from cache file before GitHub`
            },
            {
              name: ChangelogCliNames.CacheName,
              defaultValue: CHANGELOG_CACHE_NAME
            },
            {
              name: ChangelogCliNames.Version,
              type: String,
              description:
                'Generate changelog for only this version. Maps to the version field of changelog.json'
            }
          ]
        }
      ],
      options: [
        {
          name: ChangelogCliNames.Output,
          alias: 'o',

          defaultValue: path.join(workingDirectory(), CHANGELOG_OUTPUT_NAME)
        },
        {
          name: ChangelogCliNames.ConfigName,
          alias: 'c',

          defaultValue: CHANGELOG_CONFIG_NAME
        },
        {
          name: ChangelogCliNames.LogName,
          alias: 'l',

          defaultValue: CHANGELOG_NAME
        },
        {
          name: ChangelogCliNames.Format,
          type: Boolean,
          defaultValue: true
        },
        {
          name: ChangelogCliNames.GenerateCache,
          type: Boolean,
          defaultValue: true
        },
        {
          name: ChangelogCliNames.FromCache,
          type: Boolean,
          defaultValue: true
        },
        {
          name: ChangelogCliNames.CacheName,
          defaultValue: CHANGELOG_CACHE_NAME
        },
        {
          name: ChangelogCliNames.Version,
          type: String
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
      handler: () => new NewChangelogConfigCmdHandler(),
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
              name: ChangelogCliNames.Force,
              description: 'Overwrite file if it exists',
              defaultValue: false,
              type: Boolean
            },
            {
              name: ChangelogCliNames.ConfigName,
              description: 'File name of configuration file',
              defaultValue: CHANGELOG_CONFIG_NAME
            }
          ]
        }
      ],
      options: [
        {
          name: ChangelogCliNames.Force,
          type: Boolean,
          defaultValue: false
        },
        {
          name: ChangelogCliNames.ConfigName,
          defaultValue: CHANGELOG_CONFIG_NAME
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
      handler: () => new NewChangelogCmdHandler(),
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
              name: ChangelogCliNames.OutputName,
              alias: 'o',
              description: 'Name of new changelog'
            }
          ]
        }
      ],
      options: [
        {
          name: ChangelogCliNames.OutputName,
          alias: 'o',
          defaultValue: CHANGELOG_NAME
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
      command: 'cache',
      handler: () => new CacheChangelogCmdHandler(),
      sections: [
        ...introSections,
        {
          header: 'Command List',
          content: [helpCommand]
        },
        {
          header: 'Cache',
          content: chalk.magentaBright(
            'Refresh issue and pull request cache for changelog generation'
          )
        },
        {
          header: 'Options',
          optionList: [
            {
              name: ChangelogCliNames.Fresh,
              description: 'Ignore existing cache and reload all'
            },
            {
              name: ChangelogCliNames.ConfigName,
              alias: 'c',
              description:
                'File name of configuration file. Default: ' +
                CHANGELOG_CONFIG_NAME,
              defaultValue: CHANGELOG_CONFIG_NAME
            },
            {
              name: ChangelogCliNames.LogName,
              alias: 'l',
              description:
                'File name of changelog entry file. Default: ' + CHANGELOG_NAME,
              defaultValue: CHANGELOG_NAME
            },
            {
              name: ChangelogCliNames.CacheName,
              defaultValue: CHANGELOG_CACHE_NAME
            }
          ]
        }
      ],
      options: [
        {
          name: ChangelogCliNames.Fresh,
          defaultValue: false,
          type: Boolean
        },
        {
          name: ChangelogCliNames.ConfigName,
          alias: 'c',
          defaultValue: CHANGELOG_CONFIG_NAME
        },
        {
          name: ChangelogCliNames.LogName,
          alias: 'l',
          defaultValue: CHANGELOG_NAME
        },
        {
          name: ChangelogCliNames.CacheName,
          defaultValue: CHANGELOG_CACHE_NAME
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
      command: 'help',
      handler: (options?: CommandBase) => new HelpCmdHandler(options),
      sections: [],
      options: []
    }
  ]
};

export default changelogCommands;
