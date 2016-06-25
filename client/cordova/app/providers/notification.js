import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Events} from 'ionic-angular';

import Config from '../config';
import AKStorage from '../ak-storage';

@Injectable()
export class Notification {
  static get parameters() {
    return [[Events]]
  }

  constructor(events) {
    this.events = events;

    AKStorage.loadNotificationData().then(data => {
      this.__data = data || {};
    });

    this.events.subscribe('receiveNotification', (data) => {
      const {extras} = data[0];

      switch (extras.code) {
        case '100': // 拍卖师收到拍品审核请求
          this.increase('akProductCount');
          break;
        case '101': // 卖家收到拍品审核通过
        case '102': // 卖家收到拍品审核不通过
          this.increase('ownerProductCount');
          break;
      }
    });
  }

  get akProductCount() {
    return this.getItem('akProductCount') || 0;
  }

  get ownerProductCount() {
    return this.getItem('ownerProductCount') || 0;
  }

  getItem(key) {
    let data = this.__data || {};
    return data[key];
  }

  setItem(key, value) {
    let data = this.__data || {};

    data[key] = value;
    this.__data = data;
    AKStorage.saveNotificationData(data);
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
