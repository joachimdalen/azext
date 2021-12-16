import fs from 'fs/promises';
import AzExtCli from '../src/'
const validIdentifiers = ['help-definition'];

const start = /\[\/\/\]\:\s#\s'#(?<identifier>.+)\[command=(?<command>.+)\]'/gm;
const end = /\[\/\/\]\:\s#\s'#(?<identifier>.+)\[(?<command>.+)\]'/gm;
const fullMatch =
  /(?<fullcontent>(?<start>\[\/\/\]\:\s#\s'#(?<startidentifier>.+)\[command=(?<startcommand>.+)\]')(?<content>[\S\s]+)(?<end>\[\/\/\]\:\s#\s'#(?<endidentifier>.+)\[end\]'))/gm;

const files = ['../docs/changelog/generate.md'];

const replaceDefinitions = async () => {
  const fileBytes = await fs.readFile(files[0]);
  const fileString = fileBytes.toString();
  const matches = fileString.matchAll(fullMatch);
  const cli = new AzExtCli();

  for (const match of matches) {
    console.log('--------------------');
    console.log(match);
    console.log('start > ' + match.index);
    console.log('end > ' + match.length);

    const fullContent = match.groups.fullcontent;
    const startContent = match.groups.start;
    const endContent = match.groups.end;
    const command = match.groups.startcommand.split(',');
  }

  //   let m;

  //   while ((m = fullMatch.exec(fileString)) !== null) {
  //     // This is necessary to avoid infinite loops with zero-width matches
  //     if (m.index === fullMatch.lastIndex) {
  //       fullMatch.lastIndex++;
  //     }

  //     // The result can be accessed through the `m`-variable.
  //     m.forEach((match, groupIndex) => {
  //       console.log(`Found match, group ${groupIndex}: ${match}`);
  //     });
  //   }
};

replaceDefinitions().then(() => console.log('ok'));
