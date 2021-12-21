import ChangelogService from '../../../modules/changelog/changelog-service';
import ChangelogDefinition from '../../../modules/changelog/models/changelog-definition';
import fs from 'fs/promises';
import ConfigProvider from '../../../data-providers/config-provider';
import GitHub from '../../../data-providers/github';
import GitHubIssue from '../../../modules/changelog/models/github-issue';
import ChangelogEntry from '../../../modules/changelog/models/changelog-entry';

const getDef = (changes: ChangelogEntry[]) => [
  {
    publishDate: '2021-12-21',
    version: '0.0.1',
    modules: [
      {
        version: '0.0.1',
        name: 'some-module',
        changes: changes
      }
    ]
  }
];
const getFake = (number: number) => ({
  id: 12345,
  number: number,
  title: 'Some title',
  url: 'http://localhost',
  submitter: 'demo-user'
});

describe('ChangelogService', () => {
  describe('populateCache', () => {
    console.log = () => null;
    afterEach(() => {
      jest.resetAllMocks();
    });
    const getPullRequestsSpy = jest.spyOn(GitHub.prototype, 'getPullRequests');
    const getIssueSpy = jest.spyOn(GitHub.prototype, 'getIssues');
    const getConfigSpy = jest.spyOn(ConfigProvider.prototype, 'getConfig');
    it('should load issues and pull request if cache file does not exist', async () => {
      const changelog: ChangelogDefinition[] = getDef([
        {
          type: 'feature',
          description: 'some description',
          issue: 1111,
          pullRequest: 2222
        }
      ]);

      getConfigSpy.mockResolvedValueOnce(undefined);
      getIssueSpy.mockResolvedValue(getFake(1111));
      getPullRequestsSpy.mockResolvedValue(getFake(2222));

      const changelogService = new ChangelogService();
      const cacheResult = await changelogService.populateCache(
        'joachimdalen/azext',
        changelog
      );

      expect(cacheResult.issues?.length).toEqual(1);
      expect(cacheResult.pullRequests?.length).toEqual(1);
    });
    it('should load issues and pull request if cache file is empty', async () => {
      const changelog: ChangelogDefinition[] = getDef([
        {
          type: 'feature',
          description: 'some description',
          issue: 1111,
          pullRequest: 2222
        }
      ]);

      getConfigSpy.mockResolvedValueOnce({
        issues: [],
        pullRequests: []
      });
      getIssueSpy.mockResolvedValue(getFake(1111));
      getPullRequestsSpy.mockResolvedValue(getFake(2222));

      const changelogService = new ChangelogService();
      const cacheResult = await changelogService.populateCache(
        'joachimdalen/azext',
        changelog
      );

      expect(cacheResult.issues?.length).toEqual(1);
      expect(cacheResult.pullRequests?.length).toEqual(1);
    });
    it('should load issues and pull request if not found in cache', async () => {
      const changelog: ChangelogDefinition[] = getDef([
        {
          type: 'feature',
          description: 'some description',
          issue: 1111,
          pullRequest: 2222
        },
        {
          type: 'feature',
          description: 'some description',
          issue: 3333,
          pullRequest: 4444
        }
      ]);

      getConfigSpy.mockResolvedValueOnce({
        issues: [getFake(3333)],
        pullRequests: [getFake(4444)]
      });
      getIssueSpy.mockResolvedValue(getFake(1111));
      getPullRequestsSpy.mockResolvedValue(getFake(2222));

      const changelogService = new ChangelogService();
      const cacheResult = await changelogService.populateCache(
        'joachimdalen/azext',
        changelog
      );

      expect(cacheResult.issues?.length).toEqual(2);
      expect(cacheResult.pullRequests?.length).toEqual(2);
      expect(getIssueSpy).toHaveBeenCalledTimes(1);
      expect(getPullRequestsSpy).toHaveBeenCalledTimes(1);
    });
    it('should not load if all found in cache', async () => {
      const changelog: ChangelogDefinition[] = getDef([
        {
          type: 'feature',
          description: 'some description',
          issue: 1111,
          pullRequest: 2222
        },
        {
          type: 'feature',
          description: 'some description',
          issue: 3333,
          pullRequest: 4444
        }
      ]);

      getConfigSpy.mockResolvedValueOnce({
        issues: [getFake(3333), getFake(1111)],
        pullRequests: [getFake(4444), getFake(2222)]
      });
      getIssueSpy.mockResolvedValue(getFake(1111));
      getPullRequestsSpy.mockResolvedValue(getFake(2222));

      const changelogService = new ChangelogService();
      const cacheResult = await changelogService.populateCache(
        'joachimdalen/azext',
        changelog
      );

      expect(cacheResult.issues?.length).toEqual(2);
      expect(cacheResult.pullRequests?.length).toEqual(2);
      expect(getIssueSpy).toHaveBeenCalledTimes(0);
      expect(getPullRequestsSpy).toHaveBeenCalledTimes(0);
    });
  });
});
