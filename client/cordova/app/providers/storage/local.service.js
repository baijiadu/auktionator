import {Injectable} from '@angular/core';
import {Storage, LocalStorage} from 'ionic-angular';

import Config from '../../config';

@Injectable()
export class LocalService {
  static get parameters() {
    return []
  }

  constructor() {
    this.local = new Storage(LocalStorage);
  }

  // 获取第三方登录的记录
  getThirdParties() {
    if (this.thirdParties) return Promise.resolve(this.thirdParties);
    return this.local.getJson(LocalService.THIRD_PARTY).then(value => this.thirdParties = value);
  }

  // 插入或修改
  upsertThirdParty(data) {
    const {name} = data;

    if (data) {
      this.getThirdParties().then(value => {
        let newValue;
        if (!value || value.length <= 0 || value.find((tp) => tp.name === name)) {
          newValue = [data];
        } else {
          const position = value.findIndex((tp) => tp.name === name);
          newValue = Object.assign([], value);
          newValue.splice(position, 1, data);
        }
        this.local.setJson(LocalService.THIRD_PARTY, newValue);
      })
    }
  }
}

LocalService.THIRD_PARTY = 'AK_' + 'THIRD_PARTY';
