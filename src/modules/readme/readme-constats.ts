import { ReadmeConfig } from './models/readme-config';

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
