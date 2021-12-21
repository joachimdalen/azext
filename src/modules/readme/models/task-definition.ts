import { TaskInputDefinition } from '.';
import { TaskOutputVariable } from './task-output-variable';
import { TaskVersion } from './task-version';

export interface TaskDefinition {
  id: string;
  name: string;
  friendlyName: string;
  description: string;
  helpUrl: string;
  helpMarkDown: string;
  author: string;
  preview: boolean;
  version: TaskVersion;
  inputs: TaskInputDefinition[];
  outputVariables?: TaskOutputVariable[];
}
