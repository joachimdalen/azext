import ChangelogEntry from './changelog-entry';
import ChangelogModule from './changelog-module';

export default interface ChangelogDefinition {
  version: string;
  publishDate: string;
  summary?: string;
  notes?: string;
  modules: ChangelogModule[];
  changes?: ChangelogEntry[];
}
