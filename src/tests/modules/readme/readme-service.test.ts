import ReadmeService from '../../../modules/readme/readme-service';
import fs from 'fs/promises';
import { TaskDefinition } from '../../../modules/readme/models';
import TaskService from '../../../modules/readme/task-service';
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

      const result = await rmService.processReadMe('/some/readme.md');
      expect(result.indexOf('0.10.123') > 0).toBeTruthy();
    });
  });
});
