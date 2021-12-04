import chalk from "chalk";

export default {
  loadingIssues(count: number) {
    console.log(`ℹ️ Loading ${chalk.cyan(count)} issues from GitHub`);
  },
};
