import {Toast} from 'ionic-native';

let Mixins = {};
Mixins.toast = function (msg, duration = 'short', position = 'bottom') {
  Toast.show(msg, duration, position).subscribe(toast => {}, error => {}, () => {});
};

Mixins.toastAPIError = function (err, duration = null, position = null) {
  Mixins.toast(err.message || '未知错误，请稍后重试');
};

export default Mixins;
