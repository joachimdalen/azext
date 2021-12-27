import { HeaderSizes } from './header-sizes';
import TextFormat from './text-format';

export default interface TitleFormat extends TextFormat {
  size?: HeaderSizes;
}
