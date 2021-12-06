import { OptionDefinition } from "command-line-args";

export interface CliOptions {
  output: string;
  config: string;
  log: string;
  noFormat: boolean;
}

const options: OptionDefinition[] = [
  {
    name: "output",
    alias: "o",
    defaultValue: "CHANGELOG.md",
  },
  {
    name: "config",
    alias: "c",
    defaultValue: "changelog-config.json",
  },
  {
    name: "log",
    alias: "l",
    defaultValue: "changelog.json",
  },
  {
    name: "noformat",
    defaultValue: false,
  },
];

export default options;
