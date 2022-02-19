import path from 'path';

import ReplacementCommandFormatter, {
  ReplacementOptions
} from '../models/replacement-command-formatter';
import TaskService from '../task-service';

export interface IncludeImageFormatterOptions {
  imagePath: string;
  profile?: string;
}

export default class IncludeImageFormatter extends ReplacementCommandFormatter<IncludeImageFormatterOptions> {
  private _service: TaskService;

  constructor() {
    super();
    this._service = new TaskService();
  }
  async getFormatted(
    options: ReplacementOptions<IncludeImageFormatterOptions>
  ): Promise<any> {
    if (options.profile === undefined) {
      throw new Error('A profile is required. Set with --profile');
    }

    const config = await this._service.getReadMeConfig();

    if (config) {
      const profile = config.profiles?.find((x) => x.name === options.profile);

      if (profile === undefined) {
        throw new Error('No such profile ' + options.profile);
      }

      const imgPath = path.join(profile.imageFolder, options.imagePath);

      const imagePath = profile.relative
        ? path.join(
            path.relative(
              path.resolve(path.dirname(options.input)),
              path.resolve(path.dirname(imgPath))
            ),
            path.basename(options.imagePath)
          )
        : imgPath;

      const img = `![${options.imagePath}](${imagePath})`;
      return img;
    }

    return undefined;
  }
}
