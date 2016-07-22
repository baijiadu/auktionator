import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'gameStatus'})
export class GameStatusPipe implements PipeTransform {
  transform(status: number) {
    const statusName = {
      '0': '待发布',
      '1': '已发布',
      '2': '进行中',
      '3': '已结束',
      '10': '中断',
      '20': '其他',
    }
    return statusName['' + status] || '其他';
  }
}
