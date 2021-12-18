import IncludeFileFormatter from './formatters/include-file-formatter';
import TaskFieldFormatter from './formatters/task-field-formatter';
import TaskInputFormatter from './formatters/task-input-formatter';
import { ReadmeConfig } from './models/readme-config';
import { ReplacementCommand } from './models/replacement-command';

export const README_NAME = 'readme.json';
export const README_DEFAULT_FILE: ReadmeConfig = {
  includeOptionsFields: [
    { field: 'name', title: 'Option' },
    { field: 'defaultValue', title: 'Default Value' },
    { field: 'required', title: 'Required' },
    { field: 'helpMarkDown', title: 'Help' }
  ],
  requiredOptions: {
    false: ':x:',
    true: ':white_check_mark:'
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
    options: [{ name: 'file' }]
  }
];
