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
      case 'bold':
        this.addBold(format);
        break;
      default:
        this.addRaw(format);
    }
  }
  addH1(text: string) {
    this.addRaw(`# ${text}`);
  }
  addH2(text: string) {
    this.addRaw(`## ${text}`);
  }
  addH3(text: string) {
    this.addRaw(`### ${text}`);
  }
  addH4(text: string) {
    this.addRaw(`#### ${text}`);
  }
  addBold(text: string) {
    this.addRaw(`**${text}**`);
  }
  addListItem(text: string) {
    this.addRaw(`- ${text}`);
  }
  addSubListItem(text: string, double = false) {
    this.addRaw(double ? `\t\t - ${text}` : `\t - ${text}`);
  }
  addRaw(text: string) {
    this._content = this._content + text + EOL;
  }
  addQuote(text: string) {
    this.addRaw(`> ${text}`);
  }
  addSplitter() {
    this.addRaw('----');
  }
  addNewLine() {
    this.addRaw(EOL);
  }
  get() {
    return this._content;
  }
}
