import ConfigProvider from '../../data-providers/config-provider';
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
    const path = this._configProvider.createConfigFolderIfNotExists(
      options.root
    );
    return path;
  }
}

export default InitService;
