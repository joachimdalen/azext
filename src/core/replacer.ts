import emoji from 'node-emoji';
import { replacementCommands } from './core-constants';
import { ReplacementCommand } from './models/replacement-command';

interface ReplaceMatch {
  content?: string;
  full?: string;
}
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

  public getMatches(content: string): ReplaceMatch[] {
    const expression = /(?<full>{{(?<content>.+)}})/gm;
    const data: ReplaceMatch[] = [];
    let m;

    while ((m = expression.exec(content)) !== null) {
      if (m.index === expression.lastIndex) {
        expression.lastIndex++;
      }

      data.push({ content: m.groups?.content?.trim(), full: m.groups?.full });
    }

    return data;
  }
  getCommandId(cmd: string): string | undefined {
    const expression = /#(?<command>[a-zA-Z-]+.)\[.+\]/;
    let m;

    while ((m = expression.exec(cmd)) !== null) {
      if (m.index === expression.lastIndex) {
        expression.lastIndex++;
      }
      return m.groups?.command;
    }
  }
  getCommand(content: string) {
    const commandId = this.getCommandId(content);
    if (commandId === undefined) return undefined;

    const command = replacementCommands.find((x) => x.command === commandId);
    if (command === undefined) return undefined;

    const optionsExpression = this.getCommandExpression(command);
    const optionGroups = this.getOptionGroups(content, optionsExpression);

    if (optionGroups === undefined) return undefined;

    const options = this.mapGroupsToOptions(command, optionGroups);

    return {
      command: command,
      options: options
    };
  }

  getCommandExpression(cmd: ReplacementCommand): string {
    const optionExp = (name: string) => `${name}=(?<${name}>([a-zA-Z-]+.))`;
    const optionalWrapper = (exp: string) => `(?:;${exp.replace(';', '')})?`;

    const required = cmd.options
      .filter((x) => x.optional === undefined)
      .map((x) => optionExp(x.name) + ';');
    const optional = cmd.options
      .filter((x) => x.optional === true)
      .map((x) => optionalWrapper(optionExp(x.name)));

    const req = required.join('');
    const str = [req.substring(0, req.length - 1), optional.join('')].join('');
    const exp = `#(?<command>[a-zA-Z-]+.)\\[${str}\\]`;
    return exp;
  }

  getOptionGroups(comd: string, exp: string) {
    let expression = new RegExp(exp);
    let m;

    while ((m = expression.exec(comd)) !== null) {
      if (m.index === expression.lastIndex) {
        expression.lastIndex++;
      }
      return m.groups;
    }
  }

  mapGroupsToOptions(
    command: ReplacementCommand,
    groups: { [key: string]: string }
  ) {
    let opt: { [key: string]: string | undefined } = {};

    command.options.forEach((o) => {
      opt[o.name] = groups && groups[o.name];
    });

    return opt;
  }
}
export default Replacer;
