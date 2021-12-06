import { EOL } from 'os'

export default class MarkdownBuilder {
  private _content: string
  constructor() {
    this._content = ''
  }
  addH1(text: string) {
    this._content = this._content + `# ${text}` + EOL
  }
  addH2(text: string) {
    this._content = this._content + `## ${text}` + EOL
  }
  addH3(text: string) {
    this._content = this._content + `### ${text}` + EOL
  }
  addListItem(text: string) {
    this._content = this._content + `- ${text}` + EOL
  }
  addRaw(text: string) {
    this._content = this._content + text + EOL
  }
  addSplitter() {
    this._content = this._content + '---' + EOL
  }
  addNewLine() {
    this._content = this._content + EOL
  }
  get() {
    return this._content
  }
}
