import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'applyStatus'})
export class ApplyStatusPipe implements PipeTransform {
  transform(status:number) {
    const statusNames = {
      '0': '审核中',
      '1': '审核通过',
      '2': '审核未通过',
    }

    return statusNames['' + status] || '其他';
  }
}
