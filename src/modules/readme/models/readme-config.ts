import { IncludeOptionsField, ReadmePartialRoot } from '.';
import { ReadmeProfile } from './readme-profile';
import { RequiredOptions } from './required-options';

export interface ReadmeConfig {
  includeInputsFields: IncludeOptionsField[];
  requiredOptions: RequiredOptions;
  partials?: ReadmePartialRoot;
  profiles?: ReadmeProfile[];
}
