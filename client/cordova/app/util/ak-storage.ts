import {Storage, LocalStorage} from 'ionic-angular';

let store:any = {}; // 存储内存中的数据
const local = new Storage(LocalStorage);

export const AKStorage = {
  // 以下是Keys
  THIRD_PARTY: 'AK_' + 'THIRD_PARTY',
  CURRENT_USER: 'AK_' + 'CURRENT_USER',
  NOTIFICATION_DATA: 'AK_' + 'NOTIFICATION_DATA',
  HOME_DATA: 'AK_' + 'HOME_DATA',

  // 以下是接口
  // 获取所有第三方登录记录
  getThirdParties() {
    if (store.thirdParties) return Promise.resolve(store.thirdParties);
    return local.getJson(AKStorage.THIRD_PARTY).then(value => store.thirdParties = value);
  },

  // 插入或修改第三方登录记录
  upsertThirdParty(data) {
    const {name} = data;

    if (data) {
      AKStorage.getThirdParties().then(value => {
        let newValue;
        if (!value || value.length <= 0 || value.find((tp) => tp.name === name)) {
          newValue = [data];
        } else {
          const position = value.findIndex((tp) => tp.name === name);
          newValue = Object.assign([], value);
          newValue.splice(position, 1, data);
        }
        local.setJson(AKStorage.THIRD_PARTY, newValue);
      })
    }
  },
  load(key) {
    if (store[key]) return Promise.resolve(store[key]);
    return local.getJson(key).then(value => store[key] = value);
  },
  save(key, value) {
    store[key] = value;
    if (value) local.setJson(key, value);
    else local.remove(key);
  },
};
