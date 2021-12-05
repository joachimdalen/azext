export interface ChangelogDefinition {
  version: string;
  publishDate: string;
  modules: ChangelogModule[];
}
export type ChangelogArea = "feature" | "fix" | "tests" | "other";
export interface ChangelogModule {
  version: string;
  name: string;
  changes: ChangelogEntry[];
}
export interface ChangelogEntry {
  type: ChangelogArea;
  issue?: number;
  pullRequest?: number;
  description: string;
}

export interface ChangelogConfig {
  repository: string;
  releaseTitleFormat: string;
  moduleTitleFormat: string;
  taskMapping: {
    [key: string]: string;
  };
  sectionSplitter: string;
  tagMapping: {
    [key: string]: string;
  };
}
