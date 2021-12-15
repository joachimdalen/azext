export type ValidCis = 'ado';

export interface GlobalOptions {
  ci: ValidCis;
}

export interface CommandContext {
  globalOptions: GlobalOptions;
}
