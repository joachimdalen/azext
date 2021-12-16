import path from 'path';
import fs from 'fs/promises';
import { workingDirectory } from '../core/process';

class ConfigProvider {
  private readonly _defaultFolder = '.azext';

  public async createConfigFolderIfNotExists(inputPath?: string) {
    const folderPath =
      inputPath === undefined
        ? this._defaultFolder
        : path.join(inputPath, this._defaultFolder);
    try {
      await fs.stat(folderPath);
    } catch {
      await fs.mkdir(folderPath, { recursive: true });
    }

    return folderPath;
  }

  public getFullFilePath(filePath: string) {
    if (path.isAbsolute(filePath)) return filePath;
    if (filePath.startsWith('./')) return filePath;
    return path.join(workingDirectory(), this._defaultFolder, filePath);
  }

  public async getConfig<T>(filePath: string): Promise<T | undefined> {
    try {
      const resolvedPath = this.getFullFilePath(filePath);
      const fileBuffer = await fs.readFile(resolvedPath);
      const fileContent: T = JSON.parse(fileBuffer.toString());
      return fileContent;
    } catch {
      return undefined;
    }
  }

  public async writeConfig(
    filePath: string,
    data: any,
    asJson = true
  ): Promise<string> {
    await this.createConfigFolderIfNotExists();
    const resolvedPath = this.getFullFilePath(filePath);
    await fs.writeFile(
      resolvedPath,
      asJson ? JSON.stringify(data, null, 2) : data
    );

    return resolvedPath;
  }
}

export default ConfigProvider;
