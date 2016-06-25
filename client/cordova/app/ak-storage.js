import {Storage, LocalStorage} from 'ionic-angular';

let store = {}; // 存储内存中的数据
const local = new Storage(LocalStorage);
const AKStorage = {
  // 以下是Keys
  THIRD_PARTY: 'AK_' + 'THIRD_PARTY',
  CURRENT_USER: 'AK_' + 'CURRENT_USER',
  NOTIFICATION_DATA: 'AK_' + 'NOTIFICATION_DATA',

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

  // 保存当前用户信息
  saveCurrentUser(user = null) {
    if (user) local.setJson(AKStorage.CURRENT_USER, user);
    else local.remove(AKStorage.CURRENT_USER);
  },

  // 获取用户历史信息
  loadCurrentUser() {
    if (store.currentUser) return Promise.resolve(store.currentUser);
    return local.getJson(AKStorage.CURRENT_USER).then(value => store.currentUser = value);
  },

  loadNotificationData() {
    if (store.notificationData) return Promise.resolve(store.notificationData);
    return local.getJson(AKStorage.NOTIFICATION_DATA).then(value => store.notificationData = value);
  },

  saveNotificationData(data = null) {
    if (data) local.setJson(AKStorage.NOTIFICATION_DATA, data);
    else local.remove(AKStorage.NOTIFICATION_DATA);
  }
};

export default AKStorage;
