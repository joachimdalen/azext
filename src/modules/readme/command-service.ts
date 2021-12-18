import { CommandExpression } from './models';
import { ReplaceMatch } from './models/replace-match';
import { ReplacementCommand } from './models/replacement-command';
import { replacementCommands } from './readme-constats';

export default class CommandService {
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

  getCommand(content: string) {
    const commandId = this.parseCommand(content);
    if (commandId === undefined) return undefined;

    const command = replacementCommands.find(
      (x) => x.command === commandId.command
    );
    if (command === undefined) return undefined;

    const options = this.getCommandParameters(commandId.parameters, command);

    return {
      command: command,
      options: options
    };
  }

  parseCommand(cmd: string): CommandExpression | undefined {
    //const expression = /#(?<command>[a-zA-Z-]+.)\[.+\]/;
    const expression = /#(?<command>[a-zA-Z-]+.)\[(?<parameters>.+)\]/;
    let m;

    while ((m = expression.exec(cmd)) !== null) {
      if (m.index === expression.lastIndex) {
        expression.lastIndex++;
      }

      if (m.groups?.command && m.groups?.parameters) {
        return {
          command: m.groups?.command,
          parameters: m.groups?.parameters
        };
      }
      return undefined;
    }
    return undefined;
  }

  getCommandParameters(parameters: string, command: ReplacementCommand) {
    const exp = /(?<param>[a-zA-Z0-9-_]+.)=(?<val>[a-zA-Z0-9-_]+.)/g;
    let m;

    const parsedGroups: { [key: string]: string }[] = [];

    while ((m = exp.exec(parameters)) !== null) {
      if (m.index === exp.lastIndex) {
        exp.lastIndex++;
      }
      if (m.groups !== undefined) {
        parsedGroups.push(m.groups);
      }
    }

    let options: { [key: string]: string | undefined } = {};

    for (const opt of command.options) {
      const param = parsedGroups.find((p) => p.param === opt.name);

      if (param === undefined) {
        if (opt.optional === undefined || opt.optional === false) {
          throw new Error('Missing required parameter ' + opt.name);
        } else {
          continue;
        }
      }
      options[opt.name] = param.val?.replace(';', '');
    }

    return options;
  }
}
