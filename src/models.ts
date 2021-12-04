export interface ChangelogDefinition {
  version: string;
  publishDate: string;
  modules: ChangelogModule[];
}
export type ChangelogArea = "feature" | "fix" | "tests" | "other";
export interface ChangelogModule {
  type: ChangelogArea;
  issue?: number;
  pullRequest?: number;
  description: string;
}
