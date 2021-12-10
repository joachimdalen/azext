import ChangelogEntry from './changelog-entry';

export default interface ChangelogModule {
  version: string;
  name: string;
  changes: ChangelogEntry[];
}
