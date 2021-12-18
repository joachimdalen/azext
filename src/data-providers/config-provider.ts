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

  public getFullFilePath(filePath: string) {
    if (filePath === undefined) {
      return path.join(workingDirectory(), this._defaultFolder);
    }

    if (path.isAbsolute(filePath)) return filePath;
    if (filePath.startsWith('./')) return filePath;
    const resolved = path.resolve(
      workingDirectory(),
      this._defaultFolder,
      filePath
    );

    return resolved;
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
