import {NavController, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';

import {Mixins} from '../../util/index';
import {UserService} from '../../providers/index';

@Component({
  templateUrl: 'build/pages/account/verify-tel.html',
})
export class VerifyTelPage {
  verifyTelData: any;
  verifyCodeProcessing: boolean;
  verifyCodeCounter: number;
  verifyCodeInterval: any;

  constructor(private nav: NavController, private viewCtrl: ViewController, private userService: UserService) {
    this.verifyTelData = {};
    this.verifyCodeProcessing = false;
    this.verifyCodeCounter = 60;
    this.verifyCodeInterval = null;
  }

  getVerifyCode() {
    const {tel} = this.verifyTelData;

    this.userService.generateVerifyCode(tel).then(
      () => {
        Mixins.toast('验证码已发送至手机，30分钟内有效');
        this.startVerifyCodeInterval();
      },
      err => Mixins.toastAPIError(err));
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
    if (!/^1[3|4|5|7|8]\d{9}$/.test(tel)) return Mixins.toast('手机号格式不正确');
    if (!/^\d{6}$/.test(code)) return Mixins.toast('验证码格式不正确');

    this.userService.matchVerifyCode(tel, code).then(
      ts => this.viewCtrl.dismiss(tel),
      err => Mixins.toastAPIError(err));
  }
}
