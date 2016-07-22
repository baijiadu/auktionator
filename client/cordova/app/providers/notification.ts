import {Injectable} from '@angular/core';
import {Events} from 'ionic-angular';

import {Config, AKStorage} from '../util/index';

declare var window;

@Injectable()
export class Notification {
  __data: any;

  constructor(private events: Events) {
    AKStorage.load(AKStorage.NOTIFICATION_DATA).then(data => this.__data = data || {});

    this.events.subscribe('receiveNotification', (data) => {
      let jPushPlugin = window.plugins.jPushPlugin;
      const {extras} = data[0];

      switch (extras.code) {
        case '100': // 拍卖师收到拍品审核请求
          this.increase('akPendingProductCount');
          break;
        case '101': // 卖家收到拍品审核通过
          this.increase('ownerProcessingProductCount');
          break;
        case '102': // 卖家收到拍品审核不通过
          this.increase('ownerEndedProductCount');
          break;
        case '103': // 卖家收到拍品被上架
          jPushPlugin.setTags(['g_owners_' + extras.gid]);
          this.increase('ownerOnlineProductCount');
          break;
      }
    });
  }

  get akPendingProductCount() {
    return this.getItem('akPendingProductCount') || 0;
  }

  get ownerProcessingProductCount() {
    return this.getItem('ownerProcessingProductCount') || 0;
  }

  get ownerOnlineProductCount() {
    return this.getItem('ownerOnlineProductCount') || 0;
  }

  get ownerEndedProductCount() {
    return this.getItem('ownerEndedProductCount') || 0;
  }

  getItem(key) {
    let data = this.__data || {};
    return data[key];
  }

  setItem(key, value) {
    let data = this.__data || {};

    data[key] = value;
    this.__data = data;
    AKStorage.save(AKStorage.NOTIFICATION_DATA, data);
  }

  increase(key, value = 1) {
    this.setItem(key, (this.getItem(key) || 0) + value);
  }

  reduce(key, value = 1) {
    this.setItem(key, (this.getItem(key) || 0) - value);
  }

  reset(key) {
    this.setItem(key, 0);
  }
}
