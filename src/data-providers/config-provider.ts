import fs from 'fs/promises';
import path from 'path';

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

  public getFullFilePath(filePath: string, fromConfigBase = false) {
    if (!fromConfigBase) return path.resolve(workingDirectory(), filePath);
    return path.resolve(this.getConfigFolder(), filePath);
  }
  public getConfigFolder() {
    return path.join(workingDirectory(), this._defaultFolder);
  }
  public async hasConfigFolderInWorkingDir(): Promise<boolean> {
    try {
      await fs.stat(this.getConfigFolder());
      return true;
    } catch {
      return false;
    }
  }
  public getConfigPath(fileName: string) {
    if (fileName.includes(path.sep)) {
      throw new Error(
        'Expected file name, but got file path (' + fileName + ')'
      );
    }

    return path.join(this.getConfigFolder(), fileName);
  }

  public async getConfig<T>(fileName: string): Promise<T | undefined> {
    try {
      const resolvedPath = this.getConfigPath(fileName);
      const fileBuffer = await fs.readFile(resolvedPath);
      const fileContent: T = JSON.parse(fileBuffer.toString());
      return fileContent;
    } catch {
      return undefined;
    }
  }

  public async writeConfig(
    fileName: string,
    data: any,
    asJson = true
  ): Promise<string> {
    await this.createConfigFolderIfNotExists();
    const resolvedPath = this.getConfigPath(fileName);

    if (path.extname(resolvedPath) === undefined) {
      throw new Error(
        'Recieved folder path, but expected file path ' + resolvedPath
      );
    }

    await fs.writeFile(
      resolvedPath,
      asJson ? JSON.stringify(data, null, 2) : data
    );

    return resolvedPath;
  }
}

export default ConfigProvider;
