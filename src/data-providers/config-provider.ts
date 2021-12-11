import path from 'path';
import fs from 'fs/promises';

class ConfigProvider {
  private readonly _defaultFolder = '.azext';

  public async createConfigFolderIfNotExists(path?: string) {
    const folderPath = path ?? this._defaultFolder;
    try {
      await fs.stat(folderPath);
    } catch {
      await fs.mkdir(folderPath, { recursive: true });
    }
  }

  private getFullFilePath(fileName: string) {
    return path.join(process.cwd(), this._defaultFolder, fileName);
  }

  public async getConfig<T>(configName: string) {
    try {
      const fileBuffer = await fs.readFile(this.getFullFilePath(configName));
      const fileContent: T = JSON.parse(fileBuffer.toString());
      return fileContent;
    } catch {
      return undefined;
    }
  }

  public async writeConfig(configName: string, data: any, asJson = true) {
    await this.createConfigFolderIfNotExists();
    await fs.writeFile(
      this.getFullFilePath(configName),
      asJson ? JSON.stringify(data, null, 2) : data
    );
  }
}

export default ConfigProvider;
