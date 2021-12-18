import { TaskInputDefinition } from './task-input-definition';

export interface IncludeOptionsField {
  field: keyof TaskInputDefinition;
  title: string;
  align?: 'left' | 'center' | 'right';
}
