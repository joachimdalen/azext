import FormatterService from '../formatter-service';

export default abstract class ReplacementCommandFormatter<T> {
  protected _formatterService: FormatterService;
  constructor() {
    this._formatterService = new FormatterService();
  }
  getOptions(options: any) {
    return options as T;
  }
  abstract getFormatted(options: T): Promise<string>;
}
