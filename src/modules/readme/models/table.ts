import { TableHeader } from './table-header';

export interface Table {
  header: TableHeader[];
  rows: string[][];
}
