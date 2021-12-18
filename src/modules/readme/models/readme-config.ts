import { IncludeOptionsField } from '.';
import { RequiredOptions } from './required-options';

export interface ReadmeConfig {
  includeOptionsFields: IncludeOptionsField[];
  requiredOptions: RequiredOptions;
  partials?: {
    [key: string]: {
      file: string;
      format?: string;
    };
  };
}
