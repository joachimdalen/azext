import FormatterService from '../formatter-service';
import { ReadmeOptions } from '../options';

export type ReplacementOptions<T> = T & ReadmeOptions;

export default abstract class ReplacementCommandFormatter<T> {
  protected _formatterService: FormatterService;
  constructor() {
    this._formatterService = new FormatterService();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getOptions(options: any) {
    return options as ReplacementOptions<T>;
  }
  abstract getFormatted(options: ReplacementOptions<T>): Promise<string>;
}
