import { EOL } from 'os';

import { isModuleInstalled } from '../../core';
import { Table } from './models/table';

export default class FormatterService {
  formatTable(table: Table) {
    const { header, rows } = table;

    const wrap = (s: string) => `|${s}|`;
    const align = (a: 'left' | 'center' | 'right') => {
      switch (a) {
        case 'left':
          return ':---';
        case 'center':
          return ':---:';
        case 'right':
          return '---:';
      }
    };

    const headerString = wrap(header.map((x) => x.title).join('|'));
    const headerSplitter = wrap(header.map((x) => align(x.align)).join('|'));
    const rowString = rows.map((r) => wrap(r.join('|')));
    let tblString = [headerString, headerSplitter, ...rowString].join(EOL);

    if (isModuleInstalled('prettier')) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const prettier = require('prettier/standalone');
      const plugins = [require('prettier/parser-markdown')];
      tblString = prettier.format(tblString, { parser: 'markdown', plugins });
    }

    return tblString;
  }
}
