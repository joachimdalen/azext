#!/usr/bin/env node

import chalk from 'chalk';
import { exit } from 'process';

import AzExtCli from './cli/cli';

new AzExtCli().run().catch((err) => {
  console.log(chalk.redBright(err));
  exit(1);
});
