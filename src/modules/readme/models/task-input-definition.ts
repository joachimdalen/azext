import { TaskInputType } from './task-input-type';

export interface TaskInputDefinition {
  name: string;
  aliases: string[];
  label: string;
  type: TaskInputType;
  defaultValue: any;
  required: boolean;
  helpMarkDown: string;
  groupName: string;
  visibleRule: string;
  options: { [key: string]: string };
}
