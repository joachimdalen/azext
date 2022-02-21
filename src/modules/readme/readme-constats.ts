import IncludeFileFormatter from './formatters/include-file-formatter';
import IncludeImageFormatter from './formatters/include-image-formatter';
import TaskFieldFormatter from './formatters/task-field-formatter';
import TaskInputFormatter from './formatters/task-input-formatter';
import { ReadmeConfig } from './models/readme-config';
import { ReplacementCommand } from './models/replacement-command';

export const README_NAME = 'readme.json';
export const README_DEFAULT_FILE: ReadmeConfig = {
  partials: {
    'some-partial': {
      file: '../somefile.md'
    }
  }
};

export const replacementCommands: ReplacementCommand[] = [
  {
    command: 'task-input',
    formatter: () => new TaskInputFormatter(),
    options: [{ name: 'task' }, { name: 'type' }]
  },
  {
    command: 'task-field',
    formatter: () => new TaskFieldFormatter(),
    options: [
      { name: 'task' },
      { name: 'field' },
      { name: 'objectHandle', optional: true },
      { name: 'codeFormat', optional: true }
    ]
  },
  {
    command: 'include-partial',
    formatter: () => new IncludeFileFormatter(),
    options: [{ name: 'file' }, { name: 'wrap', optional: true }]
  },
  {
    command: 'include-image',
    formatter: () => new IncludeImageFormatter(),
    options: [{ name: 'imagePath' }]
  }
];
