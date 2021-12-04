import GitHub from "./github";
import { ChangelogDefinition } from "./models";

class Generator {
  private readonly _github: GitHub;
  constructor() {
    this._github = new GitHub();
  }
  generateChangelog() {
    const config = this.parseConfig("./def");
    const entries: ChangelogDefinition = this.parseLog("./def");
    const issueIds = entries.modules.map((x) => x.issue);
    const prIds = entries.modules.map((x) => x.pullRequest);
  }

  parseConfig(path: string) {}
  parseLog(path: string): any {
    return {} as ChangelogDefinition;
  }
}
