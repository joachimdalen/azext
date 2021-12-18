import { ActionResult } from '../../constants';
import ConfigProvider from '../../data-providers/config-provider';
import {
  CHANGELOG_CONFIG_NAME,
  CHANGELOG_DEFAULT_CONFIG,
  CHANGELOG_DEFAULT_FILE
} from './changelog-constants';
import Generator, { GeneratorResult } from './generator';
import ChangelogConfig from './models/changelog-config';
import {
  GenerateChangelogOptions,
  NewChangelogConfigOptions,
  NewChangelogOptions
} from './options';

class ChangelogService {
  private readonly _configProvider: ConfigProvider;
  private readonly _generator: Generator;
  constructor() {
    this._configProvider = new ConfigProvider();
    this._generator = new Generator();
  }

  async generate(
    options: GenerateChangelogOptions
  ): Promise<GeneratorResult | undefined> {
    const result = await this._generator.generateChangelog(options);
    return result;
  }
  async createDefaultConfig(
    options: NewChangelogConfigOptions
  ): Promise<ActionResult> {
    const exists = await this._configProvider.getConfig<ChangelogConfig>(
      CHANGELOG_CONFIG_NAME
    );

    if (exists !== undefined && !options.force) {
      return {
        isSuccess: false,
        message: 'Config file already exists, use --force to overwrite'
      };
    }

    const writtenPath = await this._configProvider.writeConfig(
      CHANGELOG_CONFIG_NAME,
      CHANGELOG_DEFAULT_CONFIG
    );

    return {
      isSuccess: true,
      message: `Wrote new configuration file to ${writtenPath}`
    };
  }
  async createNewFile(options: NewChangelogOptions): Promise<ActionResult> {
    const exists = await this._configProvider.getConfig<ChangelogConfig>(
      options.outputName
    );

    if (exists !== undefined) {
      return {
        isSuccess: false,
        message: 'Changelog file already exists'
      };
    }

    const writtenPath = await this._configProvider.writeConfig(
      options.outputName,
      [CHANGELOG_DEFAULT_FILE]
    );

    return {
      isSuccess: true,
      message: `New changelog written to ${writtenPath}`
    };
  }
}
export default ChangelogService;
