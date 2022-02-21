import ReadmeService from '../../../modules/readme/readme-service';
import fs from 'fs/promises';
import { TaskDefinition } from '../../../modules/readme/models';
import TaskService from '../../../modules/readme/task-service';
import { PathLike } from 'fs';
describe('ReadmeService', () => {
  describe('initReadmeConfiguration', () => {
    const readSpy = jest.spyOn(fs, 'readFile');
    const writeSpy = jest.spyOn(fs, 'writeFile');
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should create new file if not exists', async () => {
      const rmService = new ReadmeService();
      readSpy.mockRejectedValue('');
      writeSpy.mockResolvedValue();

      const result = await rmService.initReadmeConfiguration();
      expect(result?.isSuccess).toBeTruthy();
    });

    it('should not create new file if exists', async () => {
      const rmService = new ReadmeService();

      readSpy.mockResolvedValue(Buffer.from(JSON.stringify({ hello: '1' })));

      const result = await rmService.initReadmeConfiguration();
      expect(result?.isSuccess).toBeFalsy();
    });
  });
  describe('processReadMe', () => {
    const readSpy = jest.spyOn(fs, 'readFile');
    const writeSpy = jest.spyOn(fs, 'writeFile');
    const taskServiceSpy = jest.spyOn(
      TaskService.prototype,
      'getTaskDefinition'
    );
    const readmeConfigSpy = jest.spyOn(
      TaskService.prototype,
      'getReadMeConfig'
    );

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should replace single value in readme', async () => {
      const rmService = new ReadmeService();
      const readmeContent = `# Some title

           {{ #task-field[task=some_task;field=version] }}
           `;

      readSpy.mockResolvedValueOnce(readmeContent);
      taskServiceSpy.mockResolvedValue({
        version: {
          Major: 0,
          Minor: 10,
          Patch: 123
        }
      } as TaskDefinition);
      writeSpy.mockResolvedValue();

      const result = await rmService.processReadMe({
        input: '/some/readme.md',
        output: ''
      });
      expect(result.indexOf('0.10.123') > 0).toBeTruthy();
    });

    it('should break when recursion', async () => {
      process.env.AZEXT_MAX_README_ITERATION = '3';
      const rmService = new ReadmeService();
      const readmeContent = `# Some title
      
      {{ #include-partial[file=file-one] }}
          `;

      const fileOneContent = `Hello

      {{ #include-partial[file=file-two] }}
      `;
      const fileTwoContent = `{{ #include-partial[file=file-one] }}`;

      readSpy.mockImplementation((path: PathLike | any, options?: any) => {
        if (path === '/some/readme.md')
          return Promise.resolve(Buffer.from(readmeContent));
        if ((path as string).endsWith('file-one.md')) {
          return Promise.resolve(Buffer.from(fileOneContent));
        }
        if ((path as string).endsWith('file-two.md')) {
          return Promise.resolve(Buffer.from(fileTwoContent));
        }

        throw new Error('Unknown path');
      });
      readmeConfigSpy.mockResolvedValue({
        partials: {
          'file-one': {
            file: '../file-one.md'
          },
          'file-two': {
            file: '../file-two.md'
          }
        }
      });
      writeSpy.mockResolvedValue();

      expect(
        rmService.processReadMe({
          input: '/some/readme.md',
          output: ''
        })
      ).rejects.toThrow(
        'Iteration count exceeded defined limit. Possible recursion. Please check your includes'
      );
    });
    it('should replace nested content', async () => {
      process.env.AZEXT_MAX_README_ITERATION = '3';
      const rmService = new ReadmeService();
      const readmeContent = `# Some title
      
      {{ #include-partial[file=file-one] }}
          `;

      const fileOneContent = `Hello

      {{ #include-partial[file=file-two] }}
      `;
      const fileTwoContent = `{{ #task-field[task=some_task;field=version] }}`;

      readSpy.mockImplementation((path: PathLike | any, options?: any) => {
        if (path === '/some/readme.md')
          return Promise.resolve(Buffer.from(readmeContent));
        if ((path as string).endsWith('file-one.md')) {
          return Promise.resolve(Buffer.from(fileOneContent));
        }
        if ((path as string).endsWith('file-two.md')) {
          return Promise.resolve(Buffer.from(fileTwoContent));
        }

        throw new Error('Unknown path');
      });
      readmeConfigSpy.mockResolvedValue({
        partials: {
          'file-one': {
            file: '../file-one.md'
          },
          'file-two': {
            file: '../file-two.md'
          }
        }
      });
      taskServiceSpy.mockResolvedValue({
        version: {
          Major: 0,
          Minor: 10,
          Patch: 123
        }
      } as TaskDefinition);
      writeSpy.mockResolvedValue();

      const result = await rmService.processReadMe({
        input: '/some/readme.md',
        output: ''
      });
      expect(result).toContain('Some title');
      expect(result).toContain('Hello');
      expect(result).toContain('0.10.123');
    });
  });
});
