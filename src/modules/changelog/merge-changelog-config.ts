import { CHANGELOG_DEFAULT_CONFIG } from './changelog-constants';
import ChangelogConfig from './models/changelog-config';

export const mergeChangelogConfig = (
  partial: Partial<ChangelogConfig>
): ChangelogConfig => {
  return {
    ...CHANGELOG_DEFAULT_CONFIG,
    ...partial
  };
};
