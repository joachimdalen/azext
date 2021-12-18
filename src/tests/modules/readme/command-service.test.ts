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

  describe('getCommandId', () => {
    it('should return command id when matched', () => {
      const cmdService = new CommandService();
      const raw: string = '#task-input[task=some-task;type=table]';
      const commandId = cmdService.getCommandId(raw);
      expect(commandId).toEqual('task-input');
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

  describe('getCommandExpression', () => {
    it('should return correct expression for command', () => {
      const cmdService = new CommandService();
      const cmd: ReplacementCommand = {
        command: 'some-command',
        options: [{ name: 'optone' }, { name: 'opttwo' }],
        formatter: () => ({} as any)
      };

      const exp = cmdService.getCommandExpression(cmd);
      expect(exp).toEqual(
        '#(?<command>[a-zA-Z-]+.)\\[optone=(?<optone>([a-zA-Z-]+.));opttwo=(?<opttwo>([a-zA-Z-]+.))\\]'
      );
    });
  });

  describe('getOptionGroups', () => {
    it('should return correct options groups', () => {
      const cmdService = new CommandService();
      const raw: string = '#task-input[optone=one;opttwo=two]';

      const exp = cmdService.getOptionGroups(
        raw,
        '#(?<command>[a-zA-Z-]+.)\\[optone=(?<optone>([a-zA-Z-]+.));opttwo=(?<opttwo>([a-zA-Z-]+.))\\]'
      );
      expect(exp).toEqual({
        command: 'task-input',
        optone: 'one',
        opttwo: 'two'
      });
    });
  });
  describe('mapGroupsToOptions', () => {
    it('should return correct options', () => {
      const cmdService = new CommandService();
      const groups = {
        command: 'task-input',
        optone: 'one',
        opttwo: 'two'
      };
      const cmd: ReplacementCommand = {
        command: 'some-command',
        options: [{ name: 'optone' }, { name: 'opttwo' }],
        formatter: () => ({} as any)
      };
      const mapped = cmdService.mapGroupsToOptions(cmd, groups);
      expect(mapped).toEqual({
        optone: 'one',
        opttwo: 'two'
      });
    });
  });
});
