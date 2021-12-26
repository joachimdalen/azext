import chalk from 'chalk';
import commandLineUsage from 'command-line-usage';
import fs from 'fs/promises';
import { EOL } from 'os';
import AzExtCli from '../src/cli/cli';
import { introSections } from '../src/constants';
import glob from 'glob';
import { isModuleInstalled } from '../src/core/addons-checker';
import { globalOptionsSection } from '../src/cli/models';

const globFiles = function (pattern: string): Promise<string[] | undefined> {
  return new Promise((resolve, reject) => {
    glob(pattern, (err, files) =>
      err === null ? resolve(files) : reject(err)
    );
  });
};

const pattern = [
  '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
  '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))'
].join('|');

const fullMatch =
  /(?<fullcontent>(?<start>\[\/\/\]\:\s#\s["']#(?<startidentifier>.+)\[command=(?<startcommand>.+)\]["'])(?<content>[\S\s]+)(?<end>\[\/\/\]\:\s#\s["']#(?<endidentifier>.+)\[end\]["']))/gm;

const replaceDefinitions = async (path: string) => {
  console.log(
    chalk.greenBright(`Starting documentation processing for pattern: ${path}`)
  );
  const cli = new AzExtCli();
  const files = await globFiles(path);

  if (files === undefined) {
    console.error(chalk.redBright('Unable to find files'));
    return;
  }

  let prettier = undefined;
  let plugins = undefined;
  if (isModuleInstalled('prettier')) {
    prettier = require('prettier/standalone');
    plugins = [require('prettier/parser-markdown')];
    console.log('Loaded prettier');
  } else {
    console.log(
      chalk.redBright('Prettier is not installed, skipping formatting')
    );
  }

  console.log(
    `Found ${chalk.cyanBright(files.length)} documentation files to process`
  );

  for (const file of files) {
    console.log(`Processing ${chalk.cyanBright(file)}`);

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

        const sections =
          result.data?.parent?.sections || result.data?.command?.sections;
        if (sections) {
          const dt = [...sections, globalOptionsSection];
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

          console.log(`Updating ${chalk.cyanBright(file)}`);
          let newString = fileString.replace(fullContent, contentParts);

          if (prettier !== undefined) {
            console.log(`Formatting ${chalk.cyanBright(file)}`);
            newString = prettier.format(newString, {
              parser: 'markdown',
              plugins
            });
          } else {
            console.log(
              chalk.redBright('Prettier is not installed, skipping formatting')
            );
          }

          await fs.writeFile(file, newString);
          console.log(`Writing ${chalk.greenBright(file)}`);
        } else {
          console.log('Nope');
        }
      } else {
        console.log('Nope2');
      }
    }
  }
};

const replaceMultiple = async (patterns: string[]) => {
  for (const pattern of patterns) {
    await replaceDefinitions(pattern);
  }
};

replaceMultiple(['../docs/**/*.md', '../npm.md']).then(() =>
  console.log(chalk.bgGreenBright.black('Processing completed'))
);
