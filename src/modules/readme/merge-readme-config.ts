import { ReadmeConfig } from './models';
import { README_DEFAULT_FILE } from './readme-constats';

export const mergeReadmeConfig = (
  partial: Partial<ReadmeConfig>
): ReadmeConfig => {
  return {
    ...README_DEFAULT_FILE,
    ...partial
  };
};
