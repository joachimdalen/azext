import path from 'path';
import ConfigProvider from '../../data-providers/config-provider';
import fs from 'fs/promises';

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
      statSpy.mockImplementation((...args: unknown[]) => {
        throw new Error('Oop');
      });
      mkDirSpy.mockImplementation((path: any, options: any) => {
        return Promise.resolve('');
      });
      const cp = new ConfigProvider();
      const createdPath = await cp.createConfigFolderIfNotExists(
        'some-sub-folder'
      );

      expect(createdPath).toEqual(path.join('some-sub-folder', '.azext'));
      expect(statSpy).toBeCalledTimes(1);
      expect(mkDirSpy).toBeCalledTimes(1);
    });

    it('should not create if exists', async () => {
      const cp = new ConfigProvider();

      statSpy.mockImplementation(() => {
        return {} as any;
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
    const processSpy = jest.spyOn(process, 'cwd');
    const readFileSpy = jest.spyOn(fs, 'readFile');
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should return undefined when error occurrs', async () => {
      processSpy.mockReturnValue('/base/dir');
      readFileSpy.mockRejectedValue(new Error('Error'));
      const cp = new ConfigProvider();
      const result = await cp.getConfig('file.json');

      expect(result).toBeUndefined();
    });

    it('should return correct value', async () => {
      processSpy.mockReturnValue('/base/dir');
      readFileSpy.mockResolvedValue(
        Buffer.from(JSON.stringify({ name: 'hello' }))
      );
      const cp = new ConfigProvider();
      const result = await cp.getConfig<{ name: string }>('file.json');

      expect(result?.name).toEqual('hello');
    });
  });
});
