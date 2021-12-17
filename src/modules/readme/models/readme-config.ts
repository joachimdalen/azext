import { TaskInputDefinition } from '.';

export interface ReadmeConfig {
  includeOptionsFields: {
    field: keyof TaskInputDefinition;
    title: string;
    align?: 'left' | 'center' | 'right';
  }[];
  requiredOptions: {
    true: string;
    false: string;
  };
}
