import { mergeReadmeConfig } from '../../../modules/readme/merge-readme-config';
import { ReadmeConfig } from '../../../modules/readme/models';

describe('mergeReadmeConfig', () => {
  it('should merge config', () => {
    const userConfig: Partial<ReadmeConfig> = {
      partials: {
        'env-usage-one': {
          file: '../testdata/examples/exp1.yml'
        },
        'task-one-readme': {
          file: '../testdata/task1/README.md'
        },
        'task-two-readme': {
          file: '../testdata/task2/README.md'
        }
      }
    };

    const config = mergeReadmeConfig(userConfig);

    expect(config).toEqual({
      partials: {
        'env-usage-one': {
          file: '../testdata/examples/exp1.yml'
        },
        'task-one-readme': {
          file: '../testdata/task1/README.md'
        },
        'task-two-readme': {
          file: '../testdata/task2/README.md'
        }
      }
    });
  });
});
