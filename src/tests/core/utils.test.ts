import { distinct, isIssue, isNumber, isPullRequest } from '../../core';
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
});
