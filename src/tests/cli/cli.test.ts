import AzExtCli from '../../cli/cli';

describe('AzExtCli', () => {
  describe('parse', () => {
    it('should return error when passing unknown root command', async () => {
      const cli = new AzExtCli();
      const result = cli.parse(['hummer', 'help']);

      expect(result.isSuccess).toBeFalsy();
      expect(result.message).toEqual('No such root command hummer');
    });
    it('should return error when unknown sub command', async () => {
      const cli = new AzExtCli();
      const result = cli.parse(['changelog']);

      expect(result.isSuccess).toBeFalsy();
      expect(result.message).toEqual('No such sub command undefined');
    });
    it('should return sub command when defined', async () => {
      const cli = new AzExtCli();
      const result = cli.parse(['changelog', 'generate']);

      expect(result.isSuccess).toBeTruthy();
      expect(result.data).toBeDefined();
      expect(result.data?.command.handler).toBeDefined();
    });

    it('should parse options', async () => {
      const cli = new AzExtCli();
      const result = cli.parse([
        'changelog',
        'generate',
        '--output',
        'some-file.md'
      ]);

      expect(result.isSuccess).toBeTruthy();
      expect(result.data).toBeDefined();
      expect(result.data?.rest?.options.output).toEqual('some-file.md');
    });
  });
});
