import CommandService from '../../../modules/readme/command-service';
import { ReplacementCommand } from '../../../modules/readme/models/replacement-command';

describe('CommandService', () => {
  describe('getMatches', () => {
    it('should return matches when found', () => {
      const cmdService = new CommandService();
      const raw: string = `# Some title
    
          {{ task_description }}
          
          {{ #task-input[task=some_task;type=table] }}
          `;
      const replaced = cmdService.getMatches(raw);
      expect(replaced?.length).toEqual(2);
    });

    it('should return correct content', () => {
      const cmdService = new CommandService();
      const raw: string = `# Some title
    
          {{ task_description }}
          
          {{ #task-input[task=some_task;type=table] }}
          `;
      const replaced = cmdService.getMatches(raw);
      expect(replaced[0]).toEqual({
        full: '{{ task_description }}',
        content: 'task_description'
      });
      expect(replaced[1]).toEqual({
        full: '{{ #task-input[task=some_task;type=table] }}',
        content: '#task-input[task=some_task;type=table]'
      });
    });

    it('should return empty when no matches are found', () => {
      const cmdService = new CommandService();
      const raw: string = `# Some title
    
          Hello there
          `;
      const replaced = cmdService.getMatches(raw);
      expect(replaced?.length).toEqual(0);
    });
  });

  describe('getCommand', () => {
    it('should return correct command', () => {
      const cmdService = new CommandService();
      const raw: string = '#task-input[task=some-task;type=table]';
      const commandResult = cmdService.getCommand(raw);
      expect(commandResult).toBeDefined();
      expect(commandResult?.command.command).toEqual('task-input');
    });
    it('should return undefined when unknown command', () => {
      const cmdService = new CommandService();
      const raw: string = '#blerg[task=some-task;type=table]';
      const commandResult = cmdService.getCommand(raw);
      expect(commandResult).toBeUndefined();
    });
  });

  describe('parseCommand', () => {
    it('should return correct command', () => {
      const cmdService = new CommandService();
      const raw: string = '#task-input[task=some-task;type=table]';
      const commandResult = cmdService.parseCommand(raw);
      expect(commandResult).toBeDefined();
      expect(commandResult?.command).toEqual('task-input');
      expect(commandResult?.parameters).toEqual('task=some-task;type=table');
    });
  });

  describe('getCommandParameters', () => {
    it('should return correct parameters when only required', () => {
      const cmdService = new CommandService();
      const raw: string = 'task=some-task;type=table';
      const cmd: ReplacementCommand = {
        command: 'some-command',
        options: [{ name: 'task' }, { name: 'type' }],
        formatter: () => ({} as any)
      };
      const commandResult = cmdService.getCommandParameters(raw, cmd);
      expect(commandResult).toEqual({
        task: 'some-task',
        type: 'table'
      });
    });
    it('should ignore optional parameters if not defined', () => {
      const cmdService = new CommandService();
      const raw: string = 'task=some-task;type=table';
      const cmd: ReplacementCommand = {
        command: 'some-command',
        options: [
          { name: 'task' },
          { name: 'type' },
          { name: 'opt', optional: true }
        ],
        formatter: () => ({} as any)
      };
      const commandResult = cmdService.getCommandParameters(raw, cmd);
      expect(commandResult).toEqual({
        task: 'some-task',
        type: 'table'
      });
    });
    it('should parse optional parameters if defined', () => {
      const cmdService = new CommandService();
      const raw: string = 'task=some-task;type=table;opt=hello';
      const cmd: ReplacementCommand = {
        command: 'some-command',
        options: [
          { name: 'task' },
          { name: 'type' },
          { name: 'opt', optional: true }
        ],
        formatter: () => ({} as any)
      };
      const commandResult = cmdService.getCommandParameters(raw, cmd);
      expect(commandResult).toEqual({
        task: 'some-task',
        type: 'table',
        opt: 'hello'
      });
    });
    it('should throw if missing required parameter', () => {
      const cmdService = new CommandService();
      const raw: string = 'task=some-task;type=table';
      const cmd: ReplacementCommand = {
        command: 'some-command',
        options: [{ name: 'task' }, { name: 'type' }, { name: 'opt' }],
        formatter: () => ({} as any)
      };

      expect(() => {
        cmdService.getCommandParameters(raw, cmd);
      }).toThrow();
    });
  });
});
