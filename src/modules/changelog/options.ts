export interface NewChangelogConfigOptions {
  outputDir: string;
  force: boolean;
}
export interface GenerateChangelogOptions {
  output: string;
  config: string;
  log: string;
  format: boolean;
  generateCache: boolean;
  fromCache: boolean;
  cacheOutput: string;
  cacheFile: string;
  version?: string;
}
export interface NewChangelogOptions {
  output: string;
}
