import { IncludeOptionsField, ReadmePartialRoot } from '.';
import { RequiredOptions } from './required-options';

export interface ReadmeConfig {
  includeOptionsFields: IncludeOptionsField[];
  requiredOptions: RequiredOptions;
  partials?: ReadmePartialRoot;
}
