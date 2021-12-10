import { EOL } from 'os';
import { HeaderSizes } from './models/header-sizes';

export default class MarkdownBuilder {
  private _content: string;
  constructor() {
    this._content = '';
  }

  addHeader(format: string, size?: HeaderSizes) {
    if (size === undefined) {
      this.addRaw(format);
      return;
    }

    switch (size) {
      case 'h1':
        this.addH1(format);
        break;
      case 'h2':
        this.addH2(format);
        break;
      case 'h3':
        this.addH3(format);
        break;
      case 'h4':
        this.addH4(format);
        break;
      default:
        this.addRaw(format);
    }
  }
  addH1(text: string) {
    this._content = this._content + `# ${text}` + EOL;
  }
  addH2(text: string) {
    this._content = this._content + `## ${text}` + EOL;
  }
  addH3(text: string) {
    this._content = this._content + `### ${text}` + EOL;
  }
  addH4(text: string) {
    this._content = this._content + `#### ${text}` + EOL;
  }
  addListItem(text: string) {
    this._content = this._content + `- ${text}` + EOL;
  }
  addSubListItem(text: string) {
    this._content = this._content + `\t - ${text}` + EOL;
  }
  addRaw(text: string) {
    this._content = this._content + text + EOL;
  }
  addSplitter() {
    this._content = this._content + '---' + EOL;
  }
  addNewLine() {
    this._content = this._content + EOL;
  }
  get() {
    return this._content;
  }
}
