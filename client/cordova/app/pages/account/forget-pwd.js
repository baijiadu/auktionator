import {NavController, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';

@Component({
  templateUrl: 'build/pages/account/forget-pwd.html',
})
export class ForgetPwdPage {
  static get parameters() {
    return [[NavController], [ViewController]];
  }

  constructor(nav, viewCtrl) {
    this.nav = nav;
    this.viewCtrl = viewCtrl;

    this.forgetPwd = {};
    this.verifyCodeProcessing = null;
  }

  dismiss(user = null) {
    this.viewCtrl.dismiss(user);
  }
}
