import path from 'path';
import { workingDirectory } from '../../core/process';
import ConfigProvider from '../../data-providers/config-provider';
const fs = require('fs').promises;

describe('ConfigProvider', () => {
  describe('createConfigFolderIfNotExists', () => {
    const statSpy = jest.spyOn(fs, 'stat');
    const mkDirSpy = jest.spyOn(fs, 'mkdir');
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create folder in cwd if inputPath is not given', async () => {
      const cp = new ConfigProvider();

      statSpy.mockImplementation((...args: unknown[]) => {
        throw new Error('Oop');
      });

      const createdPath = await cp.createConfigFolderIfNotExists();

      expect(createdPath).toEqual('.azext');
      expect(statSpy).toBeCalledTimes(1);
      expect(mkDirSpy).toBeCalledTimes(1);
    });

    it('should create folder in path if inputPath is given', async () => {
      const cp = new ConfigProvider();

      statSpy.mockImplementation((...args: unknown[]) => {
        throw new Error('Oop');
      });

      const createdPath = await cp.createConfigFolderIfNotExists(
        'some-sub-folder'
      );

      expect(createdPath).toEqual(path.join('some-sub-folder', '.azext'));
      expect(statSpy).toBeCalledTimes(1);
      expect(mkDirSpy).toBeCalledTimes(1);
    });

    it('should not create if exists', async () => {
      const cp = new ConfigProvider();

      statSpy.mockImplementation((...args: unknown[]) => {
        return {};
      });

      const createdPath = await cp.createConfigFolderIfNotExists(
        'some-sub-folder'
      );

      expect(createdPath).toEqual(path.join('some-sub-folder', '.azext'));
      expect(statSpy).toBeCalledTimes(1);
      expect(mkDirSpy).toBeCalledTimes(0);
    });
  });
  describe('getFullFilePath', () => {
    const processSpy = jest.spyOn(process, 'cwd');
    it('should return user path if absolute', () => {
      const cp = new ConfigProvider();
      const createdPath = cp.getFullFilePath('/some/path/file.json');

      expect(createdPath).toEqual('/some/path/file.json');
    });
    it('should return user path if relative', () => {
      const cp = new ConfigProvider();
      const createdPath = cp.getFullFilePath('./some/path/file.json');

      expect(createdPath).toEqual('./some/path/file.json');
    });
    it('should return default path if user path not given', () => {
      processSpy.mockReturnValue('/base/dir');
      const cp = new ConfigProvider();
      const createdPath = cp.getFullFilePath('file.json');

      expect(createdPath).toEqual('/base/dir/.azext/file.json');
    });
  });
  describe('getConfig<T>', () => {
   
  });
});
