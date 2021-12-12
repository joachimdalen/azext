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

  public getFullFilePath(filePath: string) {
    if (path.isAbsolute(filePath)) return filePath;
    if (filePath.startsWith('./')) return filePath;
    return path.join(process.cwd(), this._defaultFolder, filePath);
  }

  public async getConfig<T>(filePath: string) {
    try {
      const resolvedPath = this.getFullFilePath(filePath);
      const fileBuffer = await fs.readFile(resolvedPath);
      const fileContent: T = JSON.parse(fileBuffer.toString());
      return fileContent;
    } catch {
      return undefined;
    }
  }

  public async writeConfig(filePath: string, data: any, asJson = true) {
    await this.createConfigFolderIfNotExists();
    const resolvedPath = this.getFullFilePath(filePath);
    await fs.writeFile(
      resolvedPath,
      asJson ? JSON.stringify(data, null, 2) : data
    );
  }
}

export default ConfigProvider;
