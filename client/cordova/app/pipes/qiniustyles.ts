import {Pipe, PipeTransform} from '@angular/core';

import {Config} from '../util/index';

@Pipe({name: 'qiniuStyles'})
export class QiniuStylesPipe implements PipeTransform {
  transform(src: string, name: string) {
    const style = Config.qiniu.styles[name];

    return style ? src + '-' + style : src;
  }
}
