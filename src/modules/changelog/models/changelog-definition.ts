import ChangelogEntry from './changelog-entry';
import ChangelogModule from './changelog-module';
import { ChangelogSection } from './changelog-section';

export default interface ChangelogDefinition {
  version: string;
  publishDate: string;
  sections?: {
    [key: string]: ChangelogSection[];
  };
  modules?: ChangelogModule[];
  changes?: ChangelogEntry[];
}
