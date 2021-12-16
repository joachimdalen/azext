import chalk from 'chalk';
import commandLineUsage from 'command-line-usage';
import fs from 'fs/promises';
import { EOL } from 'os';
import AzExtCli from '../src/cli/cli';
import { introSections } from '../src/constants';

const pattern = [
  '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
  '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))'
].join('|');

const fullMatch =
  /(?<fullcontent>(?<start>\[\/\/\]\:\s#\s'#(?<startidentifier>.+)\[command=(?<startcommand>.+)\]')(?<content>[\S\s]+)(?<end>\[\/\/\]\:\s#\s'#(?<endidentifier>.+)\[end\]'))/gm;

const files = ['../docs/changelog/generate.md', '../docs/changelog/config.md'];

const replaceDefinitions = async () => {
  const cli = new AzExtCli();

  for (const file of files) {
    const fileBytes = await fs.readFile(file);
    const fileString = fileBytes.toString();
    const matches = fileString.matchAll(fullMatch);

    for (const match of matches) {
      const fullContent = match.groups?.fullcontent;
      const startContent = match.groups?.start;
      const endContent = match.groups?.end;
      const command = match.groups?.startcommand.split(',');

      if (command && fullContent) {
        const result = cli.parse(command);

        if (result.data?.parent?.sections) {
          const dt = [...result.data.parent.sections];
          dt.splice(0, introSections.length);
          const usage = commandLineUsage(dt);

          const contentParts = [
            startContent,
            EOL,
            EOL,
            '```text',
            EOL,
            usage.replace(new RegExp(pattern, 'g'), ''),
            EOL,
            '```',
            EOL,
            EOL,
            endContent
          ].join('');
          const newString = fileString.replace(fullContent, contentParts);
          await fs.writeFile(file, newString);
          console.log(`Updated ${chalk.greenBright(file)}`);
        } else {
          console.log('Nope');
        }
      } else {
        console.log('Nope2');
      }
    }
  }
};

replaceDefinitions().then(() => console.log('ok'));
