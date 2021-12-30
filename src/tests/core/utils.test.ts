import {
  distinct,
  getChangesForAllDefinition,
  getChangesForDefinition,
  isIssue,
  isNumber,
  isPullRequest
} from '../../core';
import ChangelogDefinition from '../../modules/changelog/models/changelog-definition';
import GitHubIssue from '../../modules/changelog/models/github-issue';
import GitHubPullRequest from '../../modules/changelog/models/github-pull-request';

describe('Utils', () => {
  describe('isNumber', () => {
    it('should return true when number', () => {
      expect(isNumber(1)).toBeTruthy();
    });
    it('should return false when undefined', () => {
      expect(isNumber(undefined)).toBeFalsy();
    });
  });
  describe('isIssue', () => {
    it('should return true when issue', () => {
      const issue: GitHubIssue = {
        id: 1,
        title: 'Some title',
        number: 1,
        submitter: 'John',
        url: 'http://localhost'
      };
      expect(isIssue(issue)).toBeTruthy();
    });
    it('should return false when undefined', () => {
      expect(isIssue(undefined)).toBeFalsy();
    });
  });
  describe('isPullRequest', () => {
    it('should return true when pull request', () => {
      const pr: GitHubPullRequest = {
        id: 1,
        title: 'Some title',
        number: 1,
        submitter: 'John',
        url: 'http://localhost'
      };
      expect(isPullRequest(pr)).toBeTruthy();
    });
    it('should return false when undefined', () => {
      expect(isPullRequest(undefined)).toBeFalsy();
    });
  });
  describe('distinct', () => {
    it('should return distinct values', () => {
      expect([1, 2, 2, 3].filter(distinct)).toEqual([1, 2, 3]);
    });
  });
  describe('getChangesForDefinition', () => {
    it('should return correct when only root changes', () => {
      const definition: ChangelogDefinition = {
        publishDate: '2021-12-30',
        version: '0.0.1',
        changes: [
          {
            type: 'bugfix',
            description: 'Some desc'
          }
        ]
      };

      const fetched = getChangesForDefinition(definition);

      expect(fetched.length).toEqual(1);
    });
    it('should return correct when only module changes', () => {
      const definition: ChangelogDefinition = {
        publishDate: '2021-12-30',
        version: '0.0.1',
        modules: [
          {
            name: 'module-1',
            version: '0.0.1',
            changes: [
              {
                type: 'bugfix',
                description: 'Some desc'
              }
            ]
          }
        ]
      };

      const fetched = getChangesForDefinition(definition);

      expect(fetched.length).toEqual(1);
    });
    it('should return correct when root and module changes', () => {
      const definition: ChangelogDefinition = {
        publishDate: '2021-12-30',
        version: '0.0.1',
        changes: [
          {
            type: 'bugfix',
            description: 'Some desc'
          }
        ],
        modules: [
          {
            name: 'module-1',
            version: '0.0.1',
            changes: [
              {
                type: 'bugfix',
                description: 'Some desc'
              }
            ]
          }
        ]
      };

      const fetched = getChangesForDefinition(definition);

      expect(fetched.length).toEqual(2);
    });
  });
  describe('getChangesForAllDefinition', () => {
    it('should return correct when root and module changes', () => {
      const definitions: ChangelogDefinition[] = [
        {
          publishDate: '2021-12-30',
          version: '0.0.1',
          changes: [
            {
              type: 'bugfix',
              description: 'Some desc'
            }
          ],
          modules: [
            {
              name: 'module-1',
              version: '0.0.1',
              changes: [
                {
                  type: 'bugfix',
                  description: 'Some desc'
                }
              ]
            }
          ]
        },
        {
          publishDate: '2021-12-30',
          version: '0.0.1',
          changes: [
            {
              type: 'bugfix',
              description: 'Some desc'
            }
          ],
          modules: [
            {
              name: 'module-1',
              version: '0.0.1',
              changes: [
                {
                  type: 'bugfix',
                  description: 'Some desc'
                }
              ]
            }
          ]
        }
      ];

      const fetched = getChangesForAllDefinition(definitions);

      expect(fetched.length).toEqual(4);
    });
  });
});
