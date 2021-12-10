export default interface ChangelogEntry {
  type: string;
  issue?: number;
  pullRequest?: number;
  description: string;
}
