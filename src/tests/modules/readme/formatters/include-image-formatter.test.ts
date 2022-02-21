import fs from 'fs/promises';
import TaskService from '../../../../modules/readme/task-service';
import IncludeImageFormatter from '../../../../modules/readme/formatters/include-image-formatter';

describe('IncludeImageFormatter', () => {
  describe('getFormatted', () => {
    const readSpy = jest.spyOn(fs, 'readFile');
    const writeSpy = jest.spyOn(fs, 'writeFile');

    const readmeConfigSpy = jest.spyOn(
      TaskService.prototype,
      'getReadMeConfig'
    );

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should resolve absolute path', async () => {
      const formatter = new IncludeImageFormatter();

      readmeConfigSpy.mockResolvedValue({
        profiles: [
          {
            name: 'github',
            imageFolder: 'docs/some-image-path'
          }
        ]
      });

      const result = await formatter.getFormatted({
        imagePath: 'some-image.png',
        input: './some/README.md',
        output: './this.md',
        profile: 'github'
      });

      expect(result).toEqual(
        '![some-image.png](docs/some-image-path/some-image.png)'
      );
    });
    it('should resolve relative path', async () => {
      const formatter = new IncludeImageFormatter();

      readmeConfigSpy.mockResolvedValue({
        profiles: [
          {
            name: 'github',
            imageFolder: 'docs/some-image-path',
            relative: true
          }
        ]
      });

      const result = await formatter.getFormatted({
        imagePath: 'some-image.png',

        input: './some/README.md',
        output: './this.md',
        profile: 'github'
      });

      expect(result).toEqual(
        '![some-image.png](../docs/some-image-path/some-image.png)'
      );
    });
    it('should throw on unknown profile', async () => {
      const formatter = new IncludeImageFormatter();

      readmeConfigSpy.mockResolvedValue({
        profiles: [
          {
            name: 'github',
            imageFolder: 'docs/some-image-path',
            relative: true
          }
        ]
      });

      expect(async () => {
        await formatter.getFormatted({
          imagePath: 'some-image.png',
          input: './some/README.md',
          output: './this.md',
          profile: 'dummy'
        });
      }).rejects.toThrow('No such profile dummy');
    });
    it('should throw when no profile is given', async () => {
      const formatter = new IncludeImageFormatter();

      readmeConfigSpy.mockResolvedValue({
        profiles: [
          {
            name: 'github',
            imageFolder: 'docs/some-image-path',
            relative: true
          }
        ]
      });

      expect(async () => {
        await formatter.getFormatted({
          imagePath: 'some-image.png',
          input: './some/README.md',
          output: './this.md',
          profile: undefined
        });
      }).rejects.toThrow('A profile is required. Set with --profile');
    });
  });
});
