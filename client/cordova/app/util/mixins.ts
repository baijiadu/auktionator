import {Toast} from 'ionic-native';

export const Mixins = {
  toast(msg, duration = 'long', position = 'bottom') {
    Toast.show(msg, duration, position).subscribe(toast => {}, error => {}, () => {});
  },
  toastAPIError(err, duration = 'long', position = 'bottom') {
    Mixins.toast(err.message || err.ERR_MSG || '未知错误，请稍后重试', duration, position);
  }
};
