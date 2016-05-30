import {Page, NavController, ViewController} from 'ionic-angular';
import {Toast} from 'ionic-native';

import {UserService} from '../../providers/user/user.service';

@Page({
  templateUrl: 'build/pages/account/verify-tel.html',
})
export class VerifyTelPage {
  static get parameters() {
    return [[NavController], [ViewController], [UserService]];
  }

  constructor(nav, viewCtrl, userService) {
    this.nav = nav;
    this.viewCtrl = viewCtrl;
    this.userService = userService;

    this.verifyTelData = {};

    this.verifyCodeProcessing = false;
    this.verifyCodeCounter = 60;
    this.verifyCodeInterval = null;
  }

  getVerifyCode() {
    const {tel} = this.verifyTelData;

    this.userService.generateVerifyCode(tel).then(
      () => {
        Toast.showLongBottom('验证码已发送至手机，30分钟内有效');
        this.startVerifyCodeInterval();
      },
      err => Toast.showLongBottom(err.message || '未知错误，请稍后重试'));
  }

  startVerifyCodeInterval() {
    if (this.verifyCodeInterval) {
      clearInterval(this.verifyCodeInterval);
      this.verifyCodeCounter = 60;
    }
    this.verifyCodeProcessing = true;
    this.verifyCodeInterval = setInterval(() => {
      if (this.verifyCodeCounter <= 1) {
        this.verifyCodeCounter = 60;
        this.verifyCodeProcessing = false;
      } else {
        this.verifyCodeCounter--;
      }
    }, 1000);
  }

  dismiss(tel = null) {
    this.viewCtrl.dismiss(tel);
  }

  submit() {
    const {tel, code} = this.verifyTelData;
    if (!/^1[3|4|5|7|8]\d{9}$/.test(tel)) return Toast.showLongBottom('手机号格式不正确');
    if (!/^\d{6}$/.test(code)) return Toast.showLongBottom('验证码格式不正确');

    this.userService.matchVerifyCode(tel, code).then(
      ts => this.viewCtrl.dismiss(tel),
      err => Toast.showLongBottom(err.message || '未知错误，请稍后重试'));
  }
}
