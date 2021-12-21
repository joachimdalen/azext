import emoji from 'node-emoji';

class Replacer {
  private readonly _openTag = '{{';
  private readonly _closeTag = '}}';

  public replace(template: string, context: any) {
    const keys = Object.keys(context);
    let tmp = template;
    keys.forEach((k) => {
      tmp = tmp.replace(this._openTag + k + this._closeTag, context[k]);
    });
    return tmp;
  }
  public replaceEmojisIf(text: string, condition: boolean) {
    return condition ? emoji.emojify(text) : text;
  }
}
export default Replacer;
