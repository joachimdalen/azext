import { HeaderSizes } from './header-sizes';
import ReplaceEmojiesConfig from './replace-emojis-config';
import TitleFormat from './title-format';

export default interface ChangelogConfig {
  repository: string;
  changelogTitle: TitleFormat;
  releaseTitleFormat: TitleFormat;
  moduleTitleFormat: TitleFormat;
  sectionSplitter: string;
  typeSize: HeaderSizes;
  typeMapping: {
    [key: string]: string;
  };
  knownAuthors: string[];
  useDescriptiveIssues: boolean;
  useDescriptivePullRequests: boolean;
  attributionTitleFormat: TitleFormat;
  attributionSubTitle: TitleFormat;
  replaceEmojis: ReplaceEmojiesConfig;
  rootChangesTitle?: TitleFormat;
  moduleChangesTitle?: TitleFormat;
}
