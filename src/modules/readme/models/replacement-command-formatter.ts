export default abstract class ReplacementCommandFormatter<T> {
  getOptions(options: any) {
    return options as T;
  }
  abstract getFormatted(options: T): Promise<string>;
}
