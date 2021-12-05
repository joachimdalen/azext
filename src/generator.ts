//import GitHub from "./github";
import { ChangelogConfig, ChangelogDefinition } from "./models";
import fs from "fs/promises";
import { EOL } from "os";
import Replacer from "./replacer";

class Generator {
  // private readonly _github: GitHub;
  constructor() {
    // this._github = new GitHub();
  }
  async generateChangelog() {
    const configString = await fs.readFile("./changelog-config.json");
    const logString = await fs.readFile("./changelog.json");

    const config: ChangelogConfig = JSON.parse(configString.toString());
    const log: ChangelogDefinition[] = JSON.parse(logString.toString());

    const issues = log.flatMap((x) =>
      x.modules.flatMap((x) => x.changes.map((x) => x.issue))
    );
    const pullRequestIds = log.flatMap((x) =>
      x.modules.flatMap((x) => x.changes.map((x) => x.pullRequest))
    );

    const distinctTags = log
      .flatMap((x) =>
        x.modules.flatMap((y) => y.changes.flatMap((z) => z.type))
      )
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

    // const id = issues[0];
    // if (id !== undefined) {
    //   const issue = await this._github.getIssues(id, config.repository);
    //   console.log(issue);
    // }
    this.buildFile(config, distinctTags, log);
  }

  buildFile(
    config: ChangelogConfig,
    tgs: string[],
    logs: ChangelogDefinition[]
  ) {
    var builder = new MarkdownBuilder();
    var replacer = new Replacer();
    builder.addH1("Changelog");

    const getSection = (tags: string[], release: ChangelogDefinition) => {
      builder.addNewLine();
      builder.addRaw(
        replacer.replace(config.releaseTitleFormat, {
          version: release.version,
          publishDate: release.publishDate,
        })
      );

      tags.forEach((tag) => {
        builder.addRaw(config.tagMapping[tag]);

        release.modules.forEach((rm) => {
          const change = rm.changes.filter((x) => x.type === tag);

          if (change.length > 0) {
            builder.addRaw(
              replacer.replace(config.moduleTitleFormat, {
                name: rm.name,
                version: rm.version,
              })
            );

            change.forEach((c) => {
              builder.addListItem(c.description);
            });
          }
        });
      });
      builder.addSplitter();
    };
    const res = logs.map((l) => getSection(tgs, l));
    console.log(builder.get());
  }
}

new Generator().generateChangelog().then(() => console.log("ok"));

class MarkdownBuilder {
  private _content: string;
  constructor() {
    this._content = "";
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
  addListItem(text: string) {
    this._content = this._content + `- ${text}` + EOL;
  }
  addRaw(text: string) {
    this._content = this._content + text + EOL;
  }
  addSplitter() {
    this._content = this._content + "---" + EOL;
  }
  addNewLine() {
    this._content = this._content + EOL;
  }
  get() {
    return this._content;
  }
}
