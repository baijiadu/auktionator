import {Pipe} from '@angular/core';

@Pipe({name: 'productStatus'})
export class ProductStatusPipe {
  transform(status) {
    const statusName = {
      '0': '审核中',
      '1': '已确认',
      '2': '已选择',
      '3': '已上架',
      '4': '竞拍中',
      '5': '竞拍成功',
      '10': '已拒绝',
      '11': '已过期',
      '12': '流拍',
      '20': '其他',
    }
    return statusName['' + status] || '其他';
  }
}
