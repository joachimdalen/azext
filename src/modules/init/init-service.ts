import ConfigProvider from '../../data-providers/config-provider';
import { MAPPING_DEFAULT_FILE, MAPPING_NAME } from './init-constants';
import { InitOptions } from './options';
import path from 'path';
import { DefaultMapping } from './models';
import { ActionResult } from '../../constants';
class InitService {
  private _configProvider: ConfigProvider;
  constructor() {
    this._configProvider = new ConfigProvider();
  }
  /**
   * Create a new .azext folder in the given location
   * @param options
   * @returns Path of created folder
   */
  public async init(options: InitOptions): Promise<string> {
    const filePath = this._configProvider.createConfigFolderIfNotExists(
      options.root
    );
    return filePath;
  }

  public async initMappingConfiguration(
    options: InitOptions
  ): Promise<ActionResult> {
    let fullPath = this._configProvider.getFullFilePath(options.root);

    if (fullPath && path.extname(fullPath) !== undefined) {
      fullPath = path.join(fullPath, MAPPING_NAME);
    }

    const exists = await this._configProvider.getConfig<DefaultMapping>(
      fullPath
    );

    if (exists !== undefined) {
      return {
        isSuccess: false,
        message: 'Mapping file already exists'
      };
    }

    const filePath = await this._configProvider.writeConfig(
      fullPath,
      MAPPING_DEFAULT_FILE
    );
    return {
      isSuccess: true,
      message: `Created new mapping configuration file at: ${filePath}`
    };
  }
}

export default InitService;
