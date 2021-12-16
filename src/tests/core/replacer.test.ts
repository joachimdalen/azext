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
});
