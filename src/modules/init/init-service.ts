import ConfigProvider from '../../data-providers/config-provider';
import { MAPPING_DEFAULT_FILE, MAPPING_NAME } from './init-constants';
import { TaskMapping } from './models';
import { InitOptions } from './options';
import path from 'path';
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

  public async initTaskMapping(options: InitOptions): Promise<string> {
    const filePath = this._configProvider.writeConfig(
      path.join(options.root, MAPPING_NAME),
      MAPPING_DEFAULT_FILE
    );
    return filePath;
  }
}

export default InitService;
