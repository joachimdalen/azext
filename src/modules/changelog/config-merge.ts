import { CHANGELOG_DEFAULT_CONFIG } from './changelog-constants';
import ChangelogConfig from './models/changelog-config';

export const mergeConfig = (partial: Partial<ChangelogConfig>) => {
  return {
    ...CHANGELOG_DEFAULT_CONFIG,
    ...partial
  };
};
