import {Pipe} from '@angular/core';

import Config from '../config';

@Pipe({name: 'qiniuStyles'})
export class QiniuStylesPipe {
  transform(src, name) {
    const style = Config.qiniu.styles[name];

    return style ? src + '-' + style : src;
  }
}
