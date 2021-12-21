import ChangelogService from "../../../modules/changelog/changelog-service";

describe('ChangelogService', () => {
  describe('populateCache', () => {
      // No cache file exists
      // Cache file is empty
      // Issues in changelog that is not in cache
      // Pull requests in changelog that is not in cache
      // Changelog and cache is up to date
    it('should load issues and pull request if cache file does not exist', async () => {
      const changelogService = new ChangelogService();
      const cacheResult = await changelogService.populateCache();
    });
  });
});
