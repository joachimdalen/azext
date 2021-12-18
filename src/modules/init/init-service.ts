import { ActionResult } from '../../constants';
import ConfigProvider from '../../data-providers/config-provider';
import { MAPPING_DEFAULT_FILE, MAPPING_NAME } from './init-constants';
import { DefaultMapping } from './models';
import { InitOptions } from './options';
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

  public async initMappingConfiguration(): Promise<ActionResult> {
    const exists = await this._configProvider.getConfig<DefaultMapping>(
      MAPPING_NAME
    );

    if (exists !== undefined) {
      return {
        isSuccess: false,
        message: 'Mapping file already exists'
      };
    }

    const filePath = await this._configProvider.writeConfig(
      MAPPING_NAME,
      MAPPING_DEFAULT_FILE
    );
    return {
      isSuccess: true,
      message: `Created new mapping configuration file at: ${filePath}`
    };
  }
}

export default InitService;
