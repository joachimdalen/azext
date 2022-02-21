import { ReadmePartialRoot } from '.';
import { ReadmeProfile } from './readme-profile';

export interface ReadmeConfig {
  partials?: ReadmePartialRoot;
  profiles?: ReadmeProfile[];
}
