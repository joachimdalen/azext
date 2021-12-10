import ChangelogModule from './changelog-module';

export default interface ChangelogDefinition {
  version: string;
  publishDate: string;
  modules: ChangelogModule[];
}
