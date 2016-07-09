import {Pipe} from '@angular/core';

@Pipe({name: 'productStatus'})
export class ProductStatusPipe {
  transform(status, identity) {
    const identityStatusName = [{
      // 买家
    }, {
      // 卖家
      '0': '审核中',
      '1': '已确认',
      '2': '已选择',
      '3': '已上架',
      '4': '竞拍中',
      '5': '竞拍成功',
      '6': '待选择',
      '10': '已拒绝',
      '11': '已过期',
      '12': '流拍',
      '13': '编辑中',
      '14': '已取消',
      '20': '其他',
    }, {
      '0': '待审核',
      '1': '可选择',
      '2': '已选择',
      '3': '已上架',
      '4': '竞拍中',
      '5': '竞拍成功',
      '6': '可选择',
      '10': '已拒绝',
      '11': '已过期',
      '12': '流拍',
      '14': '已取消',
      '20': '其他',
    }, {
      // 管理员
    }];

    return identityStatusName[identity]['' + status] || '其他';
  }
}
