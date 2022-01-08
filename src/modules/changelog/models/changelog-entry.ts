export default interface ChangelogEntry {
  type: string;
  issue?: number | number[];
  pullRequest?: number | number[];
  description: string;
}
