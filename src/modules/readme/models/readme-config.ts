import { IncludeOptionsField, ReadmePartialRoot } from '.';
import { RequiredOptions } from './required-options';

export interface ReadmeConfig {
  includeInputsFields: IncludeOptionsField[];
  requiredOptions: RequiredOptions;
  partials?: ReadmePartialRoot;
}
