export interface NewChangelogConfigOptions {
  /**
   * File name of configuration file
   */
  configName: string;
  /**
   * Overwrite file if extists
   */
  force: boolean;
}
export interface GenerateChangelogOptions {
  /**
   * Full path to output file
   */
  output: string;
  /**
   * File name of configuration file
   */
  configName: string;
  /**
   * File name of changelog file
   */
  logName: string;
  /**
   * Format file before writing it
   */
  format: boolean;
  /**
   * If cache should be generated
   */
  generateCache: boolean;
  /**
   * Should load from cache
   */
  fromCache: boolean;
  /**
   * File name of cache file
   */
  cacheName: string;
  /**
   * Generate cache for only this version
   */
  version?: string;
}
export interface NewChangelogOptions {
  outputName: string;
}
