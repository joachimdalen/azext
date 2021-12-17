import { ReplacementCommand } from '../../core/models/replacement-command';
import Replacer from '../../core/replacer';

describe('Replacer', () => {
  describe('replace', () => {
    it('should replace if defined', () => {
      const replacer = new Replacer();
      const raw: string = 'Hello, {{name}}';
      const replaced = replacer.replace(raw, {
        name: 'Jerry'
      });

      expect(replaced).toEqual('Hello, Jerry');
    });

    it('does not replace unknown values', () => {
      const replacer = new Replacer();
      const raw: string = 'Hello, {{name}}';
      const replaced = replacer.replace(raw, {
        age: 10
      });

      expect(replaced).toEqual(raw);
    });
  });
  describe('replaceEmojisIf', () => {
    it('should replace when condition is true', () => {
      const replacer = new Replacer();
      const raw: string = 'Hello, :rocket:';
      const replaced = replacer.replaceEmojisIf(raw, true);
      expect(replaced).not.toEqual(raw);
    });
    it('should not replace when condition is false', () => {
      const replacer = new Replacer();
      const raw: string = 'Hello, :rocket:';
      const replaced = replacer.replaceEmojisIf(raw, false);
      expect(replaced).toEqual(raw);
    });
  });

  describe('getMatches', () => {
    it('should return matches when found', () => {
      const replacer = new Replacer();
      const raw: string = `# Some title

      {{ task_description }}
      
      {{ #task-usage[task=some_task;type=table] }}
      `;
      const replaced = replacer.getMatches(raw);
      expect(replaced?.length).toEqual(2);
    });

    it('should return correct content', () => {
      const replacer = new Replacer();
      const raw: string = `# Some title

      {{ task_description }}
      
      {{ #task-usage[task=some_task;type=table] }}
      `;
      const replaced = replacer.getMatches(raw);
      expect(replaced[0]).toEqual({
        full: '{{ task_description }}',
        content: 'task_description'
      });
      expect(replaced[1]).toEqual({
        full: '{{ #task-usage[task=some_task;type=table] }}',
        content: '#task-usage[task=some_task;type=table]'
      });
    });

    it('should return empty when no matches are found', () => {
      const replacer = new Replacer();
      const raw: string = `# Some title

      Hello there
      `;
      const replaced = replacer.getMatches(raw);
      expect(replaced?.length).toEqual(0);
    });
  });

  describe('getCommandId', () => {
    it('should return command id when matched', () => {
      const replacer = new Replacer();
      const raw: string = '#task-usage[task=some-task;type=table]';
      const commandId = replacer.getCommandId(raw);
      expect(commandId).toEqual('task-usage');
    });
  });
  describe('getCommand', () => {
    it('should return correct command', () => {
      const replacer = new Replacer();
      const raw: string = '#task-usage[task=some-task;type=table]';
      const commandResult = replacer.getCommand(raw);
      expect(commandResult).toBeDefined();
      expect(commandResult?.command.command).toEqual('task-usage');
    });
    it('should return undefined when unknown command', () => {
      const replacer = new Replacer();
      const raw: string = '#blerg[task=some-task;type=table]';
      const commandResult = replacer.getCommand(raw);
      expect(commandResult).toBeUndefined();
    });
  });

  describe('getCommandExpression', () => {
    it('should return correct expression for command', () => {
      const replacer = new Replacer();
      const cmd: ReplacementCommand = {
        command: 'some-command',
        options: [{ name: 'optone' }, { name: 'opttwo' }],
        formatter: () => ({} as any)
      };

      const exp = replacer.getCommandExpression(cmd);
      expect(exp).toEqual(
        '#(?<command>[a-zA-Z-]+.)\\[optone=(?<optone>([a-zA-Z-]+.));opttwo=(?<opttwo>([a-zA-Z-]+.))\\]'
      );
    });
  });

  describe('getOptionGroups', () => {
    it('should return correct options groups', () => {
      const replacer = new Replacer();
      const raw: string = '#task-usage[optone=one;opttwo=two]';

      const exp = replacer.getOptionGroups(
        raw,
        '#(?<command>[a-zA-Z-]+.)\\[optone=(?<optone>([a-zA-Z-]+.));opttwo=(?<opttwo>([a-zA-Z-]+.))\\]'
      );
      expect(exp).toEqual({
        command: 'task-usage',
        optone: 'one',
        opttwo: 'two'
      });
    });
  });
  describe('mapGroupsToOptions', () => {
    it('should return correct options', () => {
      const replacer = new Replacer();
      const groups = {
        command: 'task-usage',
        optone: 'one',
        opttwo: 'two'
      };
      const cmd: ReplacementCommand = {
        command: 'some-command',
        options: [{ name: 'optone' }, { name: 'opttwo' }],
        formatter: () => ({} as any)
      };
      const mapped = replacer.mapGroupsToOptions(cmd, groups);
      expect(mapped).toEqual({
        optone: 'one',
        opttwo: 'two'
      });
    });
  });
});
