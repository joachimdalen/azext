import { HeaderSizes } from './header-sizes';
import ReplaceEmojiesConfig from './replace-emojis-config';
import TextFormat from './text-format';
import TitleFormat from './title-format';
import TypeResourcePrefix from './type-resource-prefix';

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
  typeResourcePrefixMapping: {
    [key: string]: TypeResourcePrefix;
  };
  knownAuthors: string[];
  useDescriptiveIssues: boolean;
  useDescriptivePullRequests: boolean;
  attributionTitleFormat: TitleFormat;
  attributionSubTitle: TitleFormat;
  attributionLinkTextFormat: TextFormat;
  replaceEmojis: ReplaceEmojiesConfig;
  moduleChangesTitle?: TitleFormat;
}
