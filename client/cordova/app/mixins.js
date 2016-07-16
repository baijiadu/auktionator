import {Toast} from 'ionic-native';

import Config from './config';

let Mixins = {};
Mixins.toast = function (msg, duration = 'short', position = 'bottom') {
  Toast.show(msg, duration, position).subscribe(toast => {}, error => {}, () => {});
};

Mixins.toastAPIError = function (err, duration = 'long', position = 'bottom') {
  Mixins.toast(err.message || err.ERR_MSG || '未知错误，请稍后重试', duration, position);
};

export default Mixins;
